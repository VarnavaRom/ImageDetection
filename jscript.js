//Исходные данные хранятся в виде двумерного массива
var arrayOfElements = [
                        [4.518, 53.33, 23.1, 411.8],
                        [4.714, 47.32, 27.97, 499.2],
                        [4.943, 45.46, 24.73, 535.3],
                        [5.242, 52.01, 21.6, 474.6],
                        [5.521, 49.03, 22.43, 533.9]
                      ]

var arrayOfDistances = new Array(arrayOfElements.length);
var arrayOfIntermediates = new Array(arrayOfElements.length);

for (var i = 0; i < arrayOfElements.length; i++) {
    for (var j = 0; j < arrayOfElements.length; j++) {
        if (i == j) {
            arrayOfIntermediates[j] = 0;
        } else {
            arrayOfIntermediates[j] = distance(arrayOfElements[i],
                                      arrayOfElements[j]);
        }
    }
    arrayOfDistances[i] = arrayOfIntermediates;
    arrayOfIntermediates = new Array(arrayOfElements.length);
}

console.log(arrayOfDistances);

/*
    Вычисляет расстояние между образами
    которое на деле является эвклидовым расстоянием.
    Образы представлены в виде числовыв векторов,
    хранимые в массивах.
*/

function distance(atom1, atom2) {

    var sum = 0;

    for (var step = 0; step < atom1.length; step++) {
        sum += Math.pow((atom1[step]-atom2[step]), 2);
    }

    return Math.round(Math.sqrt(sum));
}

