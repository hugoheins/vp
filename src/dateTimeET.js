const dateFormattedET = function(parameeter) {
    let timeNow = new Date();
    if (parameeter == 0) {
        const monthNamesET = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
        return timeNow.getDate() + '. ' + monthNamesET[timeNow.getMonth()] + ' ' + timeNow.getFullYear();
    } else {
        const monthNamesET = ['näärikuu', 'küünlakuu', 'paastukuu', 'jürikuu', 'lehekuu', 'jaanikuu', 'heinakuu', 'lõikuskuu', 'mihklikuu', 'viinakuu', 'talvekuu', 'jõulukuu'];
        return timeNow.getDate() + '. ' + monthNamesET[timeNow.getMonth()] + ' ' + timeNow.getFullYear();
    }
}

const weekdayET = function() {
    let weekDay = new Date().getDay();
    const weekDayET = ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev']
    return weekDayET[weekDay]
}


const addLeadZero = function(numValue) {
    return String(numValue).padStart(2, '0');
}


const timeFormattedET = function() {
    let timeNow = new Date();
    let hourNow = timeNow.getHours();
    let minuteNow = timeNow.getMinutes();
    let secondNow = timeNow.getSeconds();
    let timeFormatted = hourNow + ':' + addLeadZero(minuteNow) + ':' + addLeadZero(secondNow);
    return timeFormatted;
}

module.exports = {fullDate: dateFormattedET, fullDay: weekdayET, fullTime: timeFormattedET}