export function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}


export function statusColor(status) {
    if (status === "Done") {return "rgb(150, 242, 119)" }
    else if (status === "Progress") {return "rgb(0, 170, 170)" }
    else if (status === "Later") {return "rgb(254, 137, 111)" }
    else if (status === "Next") {return "rgb(163, 160, 249)" }
    else return stringToColor(status)
}