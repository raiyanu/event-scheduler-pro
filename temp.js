const isOdd = (number) => {
    let isOdd;
    for (let i = 0; i < number; i++) {
        if (isOdd) {
            isOdd = false;
        } else {
            isOdd = true;
        }
    }
    return isOdd;
}

console.log(isOdd(1));
console.log(isOdd(2));
console.log(isOdd(3));
console.log(isOdd(4));