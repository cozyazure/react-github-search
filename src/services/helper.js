export const dedupeArray =
    (array, propertyName) =>
        array.filter((obj, pos, arr) =>
            arr.map(mapObj => mapObj[propertyName]).indexOf(obj[propertyName]) === pos);