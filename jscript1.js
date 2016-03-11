

// console.log(classificationArray);

var processingImage = [];

console.log("Input vector:");
ask("x1",function(x1) {
ask("x2",function(x2) {
ask("x3",function(x3) {
ask("x4",function(x4) {
            ask("q ",function(q) {

            var  classificationArray = {};
            classificationArray.cl1 =  [
                                [4.518,43.33,23.1,411.8],
                                [4.714,47.32,27.97,499.2],
                                [5.242,52.01,21.6,474.6],
                                [5.521,49.03,22.43,395.3],
                                [5.379,51.86,26.23,564.9]
                            ];
            classificationArray.cl2 =  [
                                [7.904,66.17,19.19,118.9],
                                [5.917,81.57,13.27,137.7],
                                [7.296,71.47,15.45,135.8],
                                [6.886,70.57,17.43,143]
                            ];

            classificationArray.cl3 =  [
                                [8.4,40.54,13.28,846.2],
                                [8.88,56.97,16.95,629.1],
                                [7.969,42.79,8.648,795],
                                [7.352,28.35,10.69,563],
                                [9.121,29.09,9.003,429.4],
                                [10.42,43.19,10.27,725.2],
                                [9.01,45.69,14.61,669.1]
                            ];

            classificationArray.cl4 =  [
                                [12.14,28.53,24.8,379.5],
                                [11.69,32.84,21.53,384],
                                [11.77,32.84,21.62,468.3],
                                [11.06,40.08,30.42,495.5],
                                [10.17,25.49,26.17,364.4],
                                [10.76,28.67,25.15,429.6]
                            ];

            var processingArray = new Array(x1,x2,x3,x4);
            var d = [];
            var matchClass = 0;
            var neargheboars = new Array(4);
            var min = 0.0;
            var n = 0;
            var i, j, z;

            for (i = 0; i < 4; i++){
                neargheboars[i] = 0;
            }

            for (i = 1; i < 5; i++) {
                n = classificationArray['cl'+i].length;
                for (j = 0; j < n; j++) {
                    d.push(calculateDistance(   classificationArray['cl'+i][j],
                                                processingArray));
                }
            }

            // console.log(d);
            for (z = 0; z < q; z++) {
                for (i = 1; i < 5; i++) {
                    n = classificationArray['cl'+i].length;
                    // console.log(n);
                    for (var j = 0; j < n; j++) {
                        if (d.sort()[z] == calculateDistance(classificationArray['cl'+i][j],
                                                 processingArray)) {
                            min++;
                        }
                    }
                    // console.log(min);
                    neargheboars[i-1] += min;
                    min = 0.0;
                }
            }

            console.log('Class'+(lookForMax(neargheboars)));

            process.exit();

                });
            });
        })
    });
});


function lookForMax(someArray) {
    var max = 0.0;
    var max_i = 0;
    var max_count = 0;
    var intermedArray = []
    for (var i = 0; i < someArray.length; i++){
        if (max < someArray[i]) {
            max = someArray[i];
            max_i = i;
        }
    }
    for (var i = 0; i < someArray.length; i++){
        if (someArray[i] == max){
            max_count++;
            intermedArray.push(i+1); }
    }

    return intermedArray;
}


function ask(question, callback) {
    var stdin = process.stdin, stdout = process.stdout;

    stdin.resume();
    stdout.write(question + ": ");

    stdin.once('data', function(data) {
        data = data.toString().trim();
        callback(data);
    });
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
