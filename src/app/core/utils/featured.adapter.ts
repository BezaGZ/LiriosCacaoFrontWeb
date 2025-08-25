import { FeaturedPreset } from './featured.models';
import { buildChocoImagePaths } from './image-resolver';
import { CHOCOFRUTA_SEED } from '../../data';
import { calcularPrecioUnitarioChocofruta } from '../../data/chocofruta.logic';

export interface FeaturedCardVM {
  id: string;
  imageUrl: string;
  imgPaths: { withTop: string; withoutTop: string; fallback: string };
  price: number;
  meta: {
    frutaNombre: string;
    chocolateNombre: string;
    toppings: string[];
  };
}

export function presetToCard(p: FeaturedPreset): FeaturedCardVM {
  const topPrincipal = p.toppings?.[0]?.nombre;
  const imgPaths = buildChocoImagePaths(
    p.fruta.nombre,
    p.chocolate.nombre,
    topPrincipal
  );
  const imageUrl = imgPaths.withTop || imgPaths.withoutTop || imgPaths.fallback;

  const price = calcularPrecioUnitarioChocofruta(
    {
      fruta: p.fruta,
      chocolate: p.chocolate,
      toppings: p.toppings,
      dobleChocolate: p.dobleChocolate ?? false,
      cantidad: 1,
    },
    CHOCOFRUTA_SEED.reglas
  );

  return {
    id: p.id,
    imageUrl,
    imgPaths,
    price,
    meta: {
      frutaNombre: p.fruta.nombre,
      chocolateNombre: p.chocolate.nombre,
      toppings: p.toppings.map((t) => t.nombre),
    },
  };
}
