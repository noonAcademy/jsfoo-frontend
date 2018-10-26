/**
 * Function calculates the distance between two coordinates.
 * Ref: Co-ordinate Geometry Formulas - https://orion.math.iastate.edu/dept/links/formulas/form2.pdf
 * 
 * @param {number} x1, x-coordinate for point P
 * @param {number} y1, y-coordinate for point P
 * @param {number} x2, x-coordinate for point Q
 * @param {number} y2, y-coordinate for point Q
 * @returns {number}
 */
export const distanceBetweenCoordinates = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
};