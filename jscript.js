//Исходные данные хранятся в виде двумерного массива
var arrayOfElements = [
                        [4.518, 53.33, 23.1, 411.8],
                        [4.714, 47.32, 27.97, 499.2],
                        [4.943, 45.46, 24.73, 535.3],
                        [5.242, 52.01, 21.6, 474.6],
                        [5.521, 49.03, 22.43, 533.9],
                        [7.904, 66.17, 19.19, 118.9],
                        [5.917, 81.57, 13.27, 137.7],
                        [7.296, 71.47, 15.45, 135.8],
                        [6.886, 70.57, 17.43, 143],
                        [8.4, 40.54, 13.28, 846.2],
                        [8.88, 56.97, 16.95, 629.1],
                        [7.969, 42.79, 8.648, 795],
                        [7.352, 28.35, 10.69, 563],
                        [9.121, 29.09, 9.003, 429.4],
                        [10.42, 43.19, 10.27, 725.2],
                        [9.01, 45.69, 14.61, 669.1],
                        [12.14, 28.53, 24.8, 379.5],
                        [11.69, 32.84, 21.53, 384],
                        [11.77, 28.64, 21.62, 468.3],
                        [11.06, 40.08, 30.42, 495.5],
                        [10.17, 25.49, 26.17, 364.4],
                        [10.76, 28.67, 25.15, 429.6],
                        [11.56, 38.88, 23.23, 584.7],
                        [11.21, 21.83, 29.65, 380.7]
]

/*  Массив, в который будет записана нормализованная
    таблица с расстояниями между образами
*/
var arrayOfDistances = new Array(arrayOfElements.length);

//  В этот массив записываются промежуточные значения
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
    //Очистка промежуточного массива
    arrayOfIntermediates = new Array(arrayOfElements.length);
}

//Выводим полученную таблицу в подобающем виде
var stringlog = '';
for (i = 0; i < arrayOfDistances.length; i++){
    stringlog = arrayOfDistances[i].join('\t');
    console.log(stringlog);
    stringlog = '';
}

/*
    В этот массив будут записываться номера образов,
    которые будут объединены в кластер.
    Нумерация образов с 0.
*/
var candidatesToUnion = new Array(2);

candidatesToUnion = indexesOfMin(arrayOfDistances);

/*
    Находит минимальный элемент в массиве.
    Возвращает массив из двух элементов:
    первый - номер строки, второй - столбец этого элемента.
    Его номер строки и столбца указывает на образы,
    которые являются кандидатами на объединение кластер.
*/

function indexesOfMin(arrayOfElements){

    // Расстояние не может быть больше бесконечности :D
    var min = Infinity;
    var indexOfMin = new Array(2);

    // Находим минимальный элемент
    for (i = 0; i < arrayOfElements.length; i++){
        for (j = 0; j < arrayOfElements.length; j++){
            //Проверяются только элементы выше главной диагонали
            if (j > i) {
                if (min > arrayOfDistances[i][j]){
                    min = arrayOfDistances[i][j];
                    indexOfMin[0] = i;
                    indexOfMin[1] = j;
                }
            }
        }
    }

    return indexOfMin;
}

/*
    Вычисляет расстояние между образами
    которое на деле является эвклидовым расстоянием.
    Образы представлены в виде числовых векторов,
    хранимые в массивах.
*/

function distance(atom1, atom2) {

    var sum = 0;

    for (var step = 0; step < atom1.length; step++) {
        sum += Math.pow((atom1[step]-atom2[step]), 2);
    }

    return Math.round(Math.sqrt(sum));
}
