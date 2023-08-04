import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilityService {
  /**
   * Returns string of randomly generated numbers of length digitCount
   * @param digitCount - Count of numbers to be generated randomly
   * @returns string of randomly generated numbers of length digitCount
   */
  createVerificationCode(digitCount: number = 6) {
    let array = new Array(digitCount);
    for (let index = 0; index < array.length; index++) {
      array[index] = Math.floor(Math.random() * 9);
    }
    return array.join("");
  }
  /**
   * Returns difference of minutes between two dates
   * @param dateNear - Nearest date
   * @param dateFar - Farthest date
   * @returns difference between two dates in minutes
   */
  dateDifferenceMin(dateNear: Date, dateFar: Date) {
    let differenceValue = (dateNear.getTime() - dateFar.getTime()) / 1000;
    differenceValue /= 60;
    return Math.abs(Math.round(differenceValue));
  }
}
