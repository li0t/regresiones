/** 
 * Clase para evaluar regresiones lineales y no lineales
 **/

var values = [],
    colNames = [],
    canvas, ctx, rows, cols, datosTotales = 18;

var getAround = function (that) {
    var max = that + 10,
        min = that - 10;
    var val = Math.floor(Math.random() * (max - min + 1) + min);
    return val;
}

var generateValues = function () {
    var i, j;
    rndm = Math.random() * 1,
        ranges = [
            [20, 20, 20, 40, 40, 40, 30, 30, 30, 50, 50, 50, 30, 30, 30, 40, 40, 40],
            [40, 40, 40, 70, 70, 70, 50, 50, 50, 90, 90, 90, 40, 40, 40, 50, 50, 50]
        ];

    console.log(JSON.stringify(ranges[1].reverse()));
    colNames[0] = 'X';
    colNames[1] = 'Y';

    for (i = 0; i < 2; i++) values[i] = [];

    for (i = 0; i < datosTotales; i++) {
        values[0][i] = getAround(ranges[0][i]);
        values[1][i] = getAround(ranges[1][i]);
    }

    if (rndm < 0.45) {
        values[1].reverse();
    }



    main.setValues(values);
};

/** 
 * Objecto medidor
 **/
var Medidor = {
    A: false,
    B: false,

    media: function (data) {
        var media = 0;
        for (var i = 0; i < data.length; i++)
            media += data[i];
        return media / data.length;
    },

    mediaXY: function (dataX, dataY) {
        var media = 0;
        for (var i = 0; i < dataX.length; i++)
            media += dataX[i] * dataY[i];
        return media / dataX.length;
    },


    varianza: function (data) {
        var varianza = 0,
            media = this.media(data);
        for (var i = 0; i < data.length; i++)
            varianza += Math.pow(data[i] - media, 2);
        return varianza / (data.length - 1);
    },

    desvEsta: function (data) {
        var varianza = this.varianza(data);
        return Math.sqrt(varianza);
    },

    coefVar: function (data) {
        var media = this.media(data),
            desvEsta = this.desvEsta(data);

        return (desvEsta / media) * 100;
    },

    covarianza: function (dataX, dataY) {
        var mediaX = this.media(dataX),
            mediaY = this.media(dataY),
            mediaXY = this.mediaXY(dataX, dataY);
        return mediaXY - (mediaX * mediaY);
    },

    correlacion: function (dataX, dataY) {
        var covarianza = this.covarianza(dataX, dataY),
            desvEstaX = this.desvEsta(dataX),
            desvEstaY = this.desvEsta(dataY);
        return covarianza / (desvEstaX * desvEstaY);
    },

    bondad: function (dataX, dataY) {
        var correlacion = this.correlacion(dataX, dataY);
        return Math.pow(correlacion, 2);
    },

    setRegresionLineal: function (dataX, dataY) {
        var covarianza = this.covarianza(dataX, dataY),
            varianzaX = this.varianza(dataX),
            mediaX = this.media(dataX),
            mediaY = this.media(dataY);
        this.B = covarianza / varianzaX;
        this.A = mediaY - (this.B * mediaX);
    },

    regresionLineal: function (x) {
        try {
            if (!this.B || !this.A)
                throw new Error('You must setRegresionLineal first.');
            return this.A + (this.B * x);
        } catch (err) {
            console.log(err);
        }
        return this.A + (this.B * x);
    }
}

var main = {
    min: 100,
    max: 0,

    initCanvas: function () {
        rows = datosTotales + 1;
        cols = 2;
        datosGrid = document.getElementById('datosGrid');
        medidasGrid = document.getElementById('medidasGrid');
        graphic = document.getElementById('grafico');
        ctxDatos = datosGrid.getContext('2d');
        ctxMedidas = medidasGrid.getContext('2d');
        ctxGraph = graphic.getContext('2d');
        ctxDatos.font = "15px Calibri";
        ctxMedidas.font = "15px Calibri";
    }(),

    setValues: function (grid) {
        var i = 0,
            j = 0,
            x, y;

        /**
         * Paint the columns names
         **/
        ctxDatos.fillStyle = '#04B431';
        ctxDatos.fillText(colNames[0], (datosGrid.height / rows * 0.9), (datosGrid.width / cols * 0.4));
        ctxDatos.fillText(colNames[1], (datosGrid.width / cols) + (datosGrid.width / cols * 0.4), (datosGrid.height / rows * 0.8));
        ctxDatos.fillStyle = '#000000';
        /* HAY QUE PINTAR DE OTRA MANERA */
        for (x = (datosGrid.width / cols * 0.4); x < datosGrid.width; x += (datosGrid.width / cols)) {
            for (y = (datosGrid.height / rows) + (datosGrid.height / rows * 0.65); y < datosGrid.height; y += (datosGrid.height / rows)) {
                ctxDatos.fillText(grid[i][j], x, y);
                ++j;
            }
            j = 0;
            ++i;
        }
    },

    drawDatosGrid: function () {
        ctxDatos.clearRect(0, 0, datosGrid.width, datosGrid.height);
        for (var x = 0; x <= datosGrid.width; x += (datosGrid.width / cols)) {
            ctxDatos.moveTo(x, 0);
            ctxDatos.lineTo(x, datosGrid.height);
        }

        for (var y = 0; y <= datosGrid.height + 1; y += (datosGrid.height / rows)) {
            ctxDatos.moveTo(0, y);
            ctxDatos.lineTo(datosGrid.width, y);
        }
        ctxDatos.stroke();
    }(),

    drawGraphic: function () {
        ctxGraph.rect(0, 0, graphic.width, graphic.height);

        for (var x = graphic.width / (values[0].length + 1); x < graphic.width; x += graphic.width / (values[0].length + 1)) {
            ctxGraph.moveTo(x, graphic.height);
            ctxGraph.lineTo(x, graphic.height - 5);
        }

        for (var y = graphic.height / (values[0].length + 1); y < graphic.height; y += graphic.height / (values[0].length + 1)) {
            ctxGraph.moveTo(0, y);
            ctxGraph.lineTo(5, y);
        }

        for (i = 0; i < datosTotales; i++)
            ctxGraph.fillRect(values[0][i] * 10, graphic.height - (values[1][i]) * 10, 4, 4);


        ctxGraph.moveTo(this.min * 10, graphic.height - (Medidor.regresionLineal(this.min) * 10));
        ctxGraph.lineTo(this.max * 10, graphic.height - (Medidor.regresionLineal(this.max) * 10));
        ctxGraph.stroke();


    },

    setMedidas: function () {
        for (i = 0; i < values[0].length; i++) {
            if (values[0][i] > this.max) this.max = values[0][i];
            if (values[0][i] < this.min) this.min = values[0][i];
        }

        Medidor.setRegresionLineal(values[0], values[1]);

        ctxMedidas.fillText('media X  : ' + Math.floor(Medidor.media(values[0]) * 100) / 100, 10, 15);
        ctxMedidas.fillText('media Y  : ' + Math.floor(Medidor.media(values[1]) * 100) / 100, 10, 35);
        ctxMedidas.fillText('S2 X     : ' + Math.floor(Medidor.varianza(values[0]) * 100) / 100, 10, 55);
        ctxMedidas.fillText('S2 Y es  : ' + Math.floor(Medidor.varianza(values[1]) * 100) / 100, 10, 75);
        ctxMedidas.fillText('S X      : ' + Math.floor(Medidor.desvEsta(values[0]) * 100) / 100, 10, 95);
        ctxMedidas.fillText('S y      : ' + Math.floor(Medidor.desvEsta(values[1]) * 100) / 100, 10, 115);
        ctxMedidas.fillText('C.V X    : ' + Math.floor(Medidor.coefVar(values[0]) * 100) / 100 + '%', 10, 135);
        ctxMedidas.fillText('C.V X    : ' + Math.floor(Medidor.coefVar(values[1]) * 100) / 100 + '%', 10, 155);
        ctxMedidas.fillText('media XY : ' + Math.floor(Medidor.mediaXY(values[0], values[1]) * 100) / 100, 10, 175);
        ctxMedidas.fillText('Sxy      : ' + Math.floor(Medidor.covarianza(values[0], values[1]) * 100) / 100, 10, 195);
        ctxMedidas.fillText('r        : ' + Math.floor(Medidor.correlacion(values[0], values[1]) * 100) / 100, 10, 215);
        ctxMedidas.fillText('r2       : ' + Math.floor(Medidor.bondad(values[0], values[1]) * 100) / 100, 10, 235);
        ctxMedidas.fillText('RegLineal(' + this.min + ') * 10 : ' + Medidor.regresionLineal(this.min) * 10, 10, 255);
        ctxMedidas.fillText('RegLineal(' + this.max + ') * 10 : ' + Medidor.regresionLineal(this.max) * 10, 10, 275);

        this.drawGraphic();
    }
}




document.getElementById('genDataBtn').addEventListener('click', function () {
    generateValues();
});

document.getElementById('getMedBtn').addEventListener('click', function () {
    if (values[0] === undefined) alert('Generate Data First');
    else main.setMedidas();
});