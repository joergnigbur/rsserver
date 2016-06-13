
var moment = require('moment');
var jtables = require('.//jtablegenerator/public/javascripts/localization/jquery.jtable.de.js').locale;
var extend = require('./node_modules/extend/index');

var i18n = new (require('i18n-2'))({
    locales: {
        
        'de':
 extend({
            'name': 'de',
            'countryName': 'Deutschland',
            'countryId': 65,
            'loctable': 'plz_de',
            'tables': 'Tabellen',
            'defaultDateFormat': 'DD.MM.YYYY',
            'defaultDatePickerFormat': 'dd.mm.yy',
            'defaultTimeFormat': 'HH:mm',
            'defaultDateTimeFormat': 'DD.MM.YYYY hh:mm',
            'labelDate': 'Datum',
            'labelTime': 'Uhrzeit',
        }, jtables),
        'at': {
            'name': 'at',
            'countryName': 'Österreich',
            'countryId': 10,
            'loctable': 'plz_at',
            'tables': 'Tabellen',
            'defaultDateFormat': 'DD.MM.YYYY',
            'defaultDatePickerFormat': 'dd.mm.yy',
            'defaultTimeFormat': 'HH:mm',
            'defaultDateTimeFormat': 'DD.MM.YYYY hh:mm',
        }, 'ch': {
            'name': 'ch',
            'countryName': 'Schweiz',
            'countryId': 166,
            'loctable': 'plz_ch',
            'tables': 'Tabellen',
            'defaultDateFormat': 'DD.MM.YYYY',
            'defaultDatePickerFormat': 'dd.mm.yy',
            'defaultTimeFormat': 'H:mm',
            'defaultDateTimeFormat': 'DD.MM.YYYY hh:mm',
        }
    }
});



exports.i18n = function (locale) {
    i18n.formatDate = function (time) {
        return moment(time).format('DD.MM.YYYY');
    }
    i18n.formatDateTime = function (time) {
        return moment(time).format('DD.MM.YYYY HH:mm:ss');
    }
    i18n.formatTime = function (time) {
        return moment(time).format('HH:mm:ss');
    }
    i18n.setLocale(locale);
    return i18n;
}
