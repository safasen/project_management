export const dateConv = (day,month, year) => {
    let monthAlp;
    switch (month) {
        case 1:
            monthAlp = "Jan"
            break;
        case 2:
            monthAlp = "Feb"
            break;
        case 3:
            monthAlp = "Mar"
            break;
        case 4:
            monthAlp = "Apr"
            break;
        case 5:
            monthAlp = "May"
            break;
        case 6:
            monthAlp = "Jun"
            break;
        case 7:
            monthAlp = "Jul"
            break;
        case 8:
            monthAlp = "Aug"
            break;
        case 9:
            monthAlp = "Sep"
            break;
        case 10:
            monthAlp = "Oct"
            break;
        case 11:
            monthAlp = "Nov"
            break;
        case 12:
            monthAlp = "Dec"
            break;
        default:
            break;
    }
    return day + " " + monthAlp + " " + (year + 1900)
}