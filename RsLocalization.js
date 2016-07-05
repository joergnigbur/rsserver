var moment = require('moment');
var RsLocalization = (function () {
    function RsLocalization() {
        this._i18n = new (require('i18n-2'))({
            locales: {
                'de': {
                    'name': 'de',
                    'countryName': 'Deutschland',
                    'countryId': 65,
                    'locTable': 'plz_de',
                    'tables': 'Tabellen',
                    'defaultDateFormat': 'DD.MM.YYYY',
                    'defaultDatePickerFormat': 'dd.mm.yy',
                    'defaultTimeFormat': 'HH:mm',
                    'defaultDateTimeFormat': 'DD.MM.YYYY hh:mm',
                    'labelDate': 'Datum',
                    'labelTime': 'Uhrzeit',
                },
                'at': {
                    'name': 'at',
                    'countryName': 'Österreich',
                    'countryId': 10,
                    'locTable': 'plz_at',
                    'tables': 'Tabellen',
                    'defaultDateFormat': 'DD.MM.YYYY',
                    'defaultDatePickerFormat': 'dd.mm.yy',
                    'defaultTimeFormat': 'HH:mm',
                    'defaultDateTimeFormat': 'DD.MM.YYYY hh:mm',
                }, 'ch': {
                    'name': 'ch',
                    'countryName': 'Schweiz',
                    'countryId': 166,
                    'locTable': 'plz_ch',
                    'tables': 'Tabellen',
                    'defaultDateFormat': 'DD.MM.YYYY',
                    'defaultDatePickerFormat': 'dd.mm.yy',
                    'defaultTimeFormat': 'H:mm',
                    'defaultDateTimeFormat': 'DD.MM.YYYY hh:mm',
                }
            }
        });
    }
    RsLocalization.prototype.i18n = function (locale) {
        this._i18n.formatDate = function (time) {
            return moment(time).format('DD.MM.YYYY');
        };
        this._i18n.formatDateTime = function (time) {
            return moment(time).format('DD.MM.YYYY HH:mm:ss');
        };
        this._i18n.formatTime = function (time) {
            return moment(time).format('HH:mm:ss');
        };
        this._i18n.setLocale(locale);
        return this._i18n;
    };
    return RsLocalization;
})();
exports.RsLocalization = RsLocalization;
//# sourceMappingURL=RsLocalization.js.map