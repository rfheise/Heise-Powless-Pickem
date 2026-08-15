//Shared display formatting.

//1 -> "1st", 2 -> "2nd", 11 -> "11th". A missing placing reads as a dash
//rather than an empty cell.
export function place(n:number|null|undefined):string {
    if (n === null || n === undefined) return "—"
    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`
    if (n % 10 === 1) return `${n}st`
    if (n % 10 === 2) return `${n}nd`
    if (n % 10 === 3) return `${n}rd`
    return `${n}th`
}

//+7 / -7, for margins where the sign carries the meaning
export function signed(n:number):string {
    return n > 0 ? `+${n}` : `${n}`
}
