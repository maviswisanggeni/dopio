export function getRangePrice(product) {
  const rangePrice = [];
  if (product.variants.length == 1) {
    rangePrice[0] = product.variants[0].price;
    return rangePrice;
  }
  const prices = product.variants.map(pv => pv.price);
  rangePrice[0] = Math.min(...prices);
  rangePrice[1] = Math.max(...prices);
  if (rangePrice[0] == rangePrice[1]) rangePrice.pop();
  return rangePrice;
}
