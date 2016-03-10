
var  classification = {
                        "class1" : [
                                    [4.518,43.33,23.1,411.8],
                                    [4.714,47.32,27.97,499.2],
                                    [5.242,52.01,21.6,474.6],
                                    [5.521,49.03,22.43,395.3],
                                    [5.379,51.86,26.23,564.9]
                                ],
                        "class2" : [
                                    [7.904,66.17,19.19,118.9],
                                    [5.917,81.57,13.27,137.7],
                                    [7.296,71.47,15.45,135.8],
                                    [6.886,70.57,17.43,143]
                                ],

                        "class3" : [
                                    [8.4,40.54,13.28,846.2],
                                    [8.88,56.97,16.95,629.1],
                                    [7.969,42.79,8.648,795],
                                    [7.352,28.35,10.69,563],
                                    [9.121,29.09,9.003,429.4],
                                    [10.42,43.19,10.27,725.2],
                                    [9.01,45.69,14.61,669.1]
                                ],

                        "class4" : [
                                    [12.14,28.53,24.8,379.5],
                                    [11.69,32.84,21.53,384],
                                    [11.77,32.84,21.62,468.3],
                                    [11.06,40.08,30.42,495.5],
                                    [10.17,25.49,26.17,364.4],
                                    [10.76,28.67,25.15,429.6]
                                ]
                        }

console.log(classification);

/*
    Позиционирует базовые образы по объекту Hierarchies.
    Возвращает массив базовых образов в том порядке,
    в котором они должны быть выведены
*/
function positioningBasicImages(Hierarchies, lengthHierarchies){

    var arrayOfIntermediates = [];

    for ( i = 0; i < lengthHierarchies; i++){
        for (z = 0; z < 2; z++){
            if (Hierarchies['h'+i].childElements[z][0] == 'x') {
                arrayOfIntermediates.push(Hierarchies['h'+i].childElements[z]);
            }
        }
    }

    arrayOfIntermediates.reverse();

    return arrayOfIntermediates;
}

// Добавляет в объект Hierarchies позиционирование атрибутов для вывода.
// Возвращает обновленный объект Hierarchies.
function postioningClusters(Hierarchies,lengthHierarchies){

    var i = 0;
    var j = 0;
    var z = 0;

    for (i = lengthHierarchies-1; i >= 0; i--){
        for (j = lengthHierarchies-1; j >= 0; j--) {
            for (z = 0; z < 2; z++){
                if ( 'h'+i == Hierarchies['h'+j].childElements[z]){
                    Hierarchies['h'+i].parentElement = 'h'+j;
                    Hierarchies['h'+i].position = Hierarchies['h'+j].position*2-1+z;
                }
            }
        }
    }

    return Hierarchies;
}



// Возвращает строку содержащую символ symbol размноженный в factor раз.
function muliplicateCharacter(symbol, factor) {
    var newString = '';
    for (var i = 0; i < factor; i++){
        newString += symbol;
    }

    return newString;
}
/*
    Вычисляет новые расстояния между образами и новым кластером.
    Возвращает массив, в котором добавлен новый кластер.
*/
function calculateNewDistances(arrayOfDistances){
    /*
        В этот массив будут записаны номера образов,
        которые будут объединены в кластер.
        Нумерация образов с 0.
    */
    var candidatesForUnion = new Array(2);
    candidatesForUnion = lookForMin(arrayOfDistances);

    for (var i = 0; i < arrayOfDistances.length; i++) {
        // Отбрассываем 2 класса, которые будут объединены
        if ((i != candidatesForUnion[0]) &&
            (i != candidatesForUnion[1])) {
            // ... а для остальных вычисляем в соответсвии
            // с правилом минимума новые значения и записываем
            // в конец каждой строки таблицы
            arrayOfDistances[i].push(
                Math.min(arrayOfDistances[i][candidatesForUnion[0]],
                arrayOfDistances[i][candidatesForUnion[1]])
            );
        }
    }


    // Удаляем кандидатов, которые были объединены в кластер
    arrayOfDistances = deleteCandidates(
        arrayOfDistances,
        candidatesForUnion[0],
        candidatesForUnion[1]
    );

    // В целях сохранения симметричности добавляем строку,
    // аналогичную последнему столбцу таблицы с добавлением нуля
    // так, что он окажется последним элементом главной диагонали.
    var transposedColumn = [];
    transposedColumn = transposeLastColumn(arrayOfDistances);
    arrayOfDistances.push(transposedColumn.concat(0));

    return arrayOfDistances;

    /*
        Транспонирует последний столбец таблицы.
        Возвращает транспонированный столбец в виде
        одномерного массива
    */
    function transposeLastColumn(arrayForTranspose) {

        var transposedArray = [];
        for (var i = 0; i < arrayForTranspose.length; i++) {
            transposedArray.push(+arrayForTranspose[i].slice(-1));
        }

        return transposedArray;
    }

    /*
        Удаляет в переданной таблице кандидаты на объединение,
        в порядке, который соответствует их сортировке по убыванию,
        и возвращает таблицу без них.
    */
    function deleteCandidates(tableOfDistances, candidate1, candidate2){

        // Удаляем столбцы
        for (var i = 0; i < tableOfDistances.length; i++) {
            tableOfDistances[i].splice(candidate2, 1);
            tableOfDistances[i].splice(candidate1, 1);
        }

        // Удаляем строки
        tableOfDistances.splice(candidate2, 1);
        tableOfDistances.splice(candidate1, 1);

        return tableOfDistances;
    }
}

/*
    Находит минимальный элемент в массиве.
    Возвращает массив из двух элементов:
    первый - номер строки, второй - столбец этого элемента.
    Его номер строки и столбца указывает на номера образов,
    которые являются кандидатами на объединение кластер.
*/
function lookForMin(arrayOfElements){

    // Расстояние не может быть больше бесконечности :D
    var min = Infinity;
    var indexOfMin = new Array(2);

    // Находим минимальный элемент
    for (var i = 0; i < arrayOfElements.length; i++){
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

   // Сортируем в порядке возрастания образы по их значению
    if (indexOfMin[0] > indexOfMin[1]) {
        indexOfMin[1] = [indexOfMin[0], indexOfMin[0] = indexOfMin[1]] [0]
    }

    return indexOfMin;
}

/*
    Красивый вывод
*/
function brushOutput(someArray){

    var stringlog = '';

    for (var i = 0; i < someArray.length; i++) {
        stringlog = someArray[i].join('\t');
        console.log(stringlog);
        stringlog = '';
    }
}

/*
    Возвращает массив с нормализованными данными об образах,
    в формате квадратной матрицы, элементы которой - эвклидовы
    расстояния между образами.
    На входе массив с образами.
*/
function normalizeDistances(arrayOfElements) {
    //  В этот массив записываются промежуточные значения
    var arrayOfDistances = new Array(arrayOfElements.length);
    var arrayOfIntermediates = new Array(arrayOfElements.length);

    for (var i = 0; i < arrayOfElements.length; i++) {
        for (var j = 0; j < arrayOfElements.length; j++) {
            if (i == j) {
                arrayOfIntermediates[j] = 0;
            } else {
                arrayOfIntermediates[j] = calculateDistance(arrayOfElements[i],
                                          arrayOfElements[j]);
            }
        }
        arrayOfDistances[i] = arrayOfIntermediates;
        //Очистка промежуточного массива
        arrayOfIntermediates = new Array(arrayOfElements.length);
    }

    return arrayOfDistances;

    /*
        Вычисляет расстояние между образами
        которое на деле является эвклидовым расстоянием.
        Образы представлены в виде числовых векторов,
        хранимые в массивах.
    */
    function calculateDistance(atom1, atom2) {

        var sum = 0;

        for (var i = 0; i < atom1.length; i++) {
            sum += Math.pow((atom1[i]-atom2[i]), 2);
        }

        return Math.round(Math.sqrt(sum));
    }

}
