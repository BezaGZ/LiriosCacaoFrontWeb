#!/usr/bin/env python3
"""
Optimiza las imagenes de public/assets para la web.

Por que existe: las fotos entran a la carpeta tal como salen de la camara
o del celular (hasta 12 megapixeles y 6 MB), pero en la web nunca se
muestran a mas de ~400 px. Sin este paso el sitio llego a pesar 50 MB.

Que hace:
  - Reduce cada imagen a MAX_LADO px por su lado mas largo.
  - La recomprime a 256 colores con dithering (PNG sigue siendo PNG,
    asi no hay que tocar ninguna ruta del codigo).
  - Respeta la transparencia, que todas estas imagenes usan.

Se puede correr las veces que haga falta: si una imagen ya esta optimizada
la deja igual. Despues de agregar fotos nuevas, correlo otra vez.

Uso:
    python3 scripts/optimizar-imagenes.py            # aplica los cambios
    python3 scripts/optimizar-imagenes.py --simular  # solo muestra que haria

Requiere Pillow:  pip3 install Pillow
"""

import io
import sys
import pathlib
from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'assets'

# Nada en la interfaz se muestra a mas de ~400 px de ancho; 800 cubre
# pantallas retina (2x) con margen de sobra.
MAX_LADO = 800

# Estas se dejan en su tamano original a proposito.
EXCEPCIONES = {
    # og:image / JSON-LD: WhatsApp y Facebook la piden de 1024x1024.
    # Se recomprime, pero NO se encoge.
    'img/logo.png': 1024,
}

COLORES = 256
CALIDAD_JPEG = 82
EXTENSIONES = {'.png', '.jpg', '.jpeg'}


def optimizar(ruta: pathlib.Path, simular: bool) -> tuple[int, int]:
    antes = ruta.stat().st_size
    rel = ruta.relative_to(RAIZ).as_posix()
    max_lado = EXCEPCIONES.get(rel, MAX_LADO)

    with Image.open(ruta) as original:
        im = original.convert('RGBA')
        w0, h0 = im.size

        if max(im.size) > max_lado:
            escala = max_lado / max(im.size)
            im = im.resize(
                (max(1, round(im.width * escala)), max(1, round(im.height * escala))),
                Image.LANCZOS,
            )

        # El formato correcto depende de lo que sea la imagen:
        #
        #   Producto recortado (chocofrutas, flores, logos) -> PNG con paleta.
        #   Usan transparencia de verdad y son dibujos con pocos colores, asi
        #   que 256 colores les queda perfecto y pesa poquisimo.
        #
        #   Fotografia (eventos, jardines) -> JPEG.
        #   No tienen transparencia y tienen miles de colores y degradados.
        #   Forzarlas a 256 colores las hace pesar el triple y ademas se
        #   marcan bandas en los cielos y las paredes.
        transparente = im.getchannel('A').getextrema()[0] < 255

    buf = io.BytesIO()

    if transparente:
        im.quantize(
            colors=COLORES,
            method=Image.FASTOCTREE,
            dither=Image.FLOYDSTEINBERG,
        ).save(buf, 'PNG', optimize=True)
    else:
        im.convert('RGB').save(
            buf, 'JPEG', quality=CALIDAD_JPEG, optimize=True, progressive=True,
        )

    # Se comprime EN MEMORIA y solo se escribe si de verdad quedo mas chica.
    # Asi no quedan archivos .tmp regados si el proceso se interrumpe, y no
    # hace falta borrar nada (util en entornos donde borrar esta restringido).
    despues = buf.tell()

    if despues >= antes:
        # Ya estaba optimizada: no vale la pena reescribirla.
        return antes, antes

    if simular:
        print(f'  {rel:58} {antes/1024:8.0f} KB -> {despues/1024:6.0f} KB')
        return antes, despues

    ruta.write_bytes(buf.getvalue())
    print(f'  {rel:58} {antes/1024:8.0f} KB -> {despues/1024:6.0f} KB'
          f'   ({w0}x{h0} -> {max(1, round(w0 * min(1, max_lado / max(w0, h0))))}px)')
    return antes, despues


def main() -> int:
    simular = '--simular' in sys.argv

    if not RAIZ.is_dir():
        print(f'No encuentro {RAIZ}', file=sys.stderr)
        return 1

    imagenes = sorted(
        p for p in RAIZ.rglob('*')
        if p.is_file() and p.suffix.lower() in EXTENSIONES
    )

    if simular:
        print('MODO SIMULACION: no se modifica ningun archivo\n')

    total_antes = total_despues = 0
    for ruta in imagenes:
        antes, despues = optimizar(ruta, simular)
        total_antes += antes
        total_despues += despues

    ahorro = total_antes - total_despues
    pct = (ahorro / total_antes * 100) if total_antes else 0
    print(f'\n{len(imagenes)} imagenes')
    print(f'  antes:   {total_antes/1048576:7.1f} MB')
    print(f'  despues: {total_despues/1048576:7.1f} MB')
    print(f'  ahorro:  {ahorro/1048576:7.1f} MB  ({pct:.0f}% menos)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
