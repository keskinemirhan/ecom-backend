import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
@Injectable()
export class UtilityService {
  /**
   * Returns string of randomly generated numbers of length digitCount
   * @param digitCount - Count of numbers to be generated randomly default value is 6
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

  /**
   * Hashes given string with randomly generated salt
   * and returns promise of string that contains hash and salt
   * @param string - string to be hashed
   * @returns promise of hashed string with its salt
   */
  async hashString(string: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedString = await bcrypt.hash(string, salt);
    return hashedString;
  }
  /**
   * Compares given string with the hashed one
   * if hashed version of normal string does not match
   * returns promise of false if matches returns
   * promise of true
   *
   * @param normal - non-hashed string to compare with hashed one
   * @param hashed - hashed string to compare
   * @returns true if match else false
   */
  async compareHash(normal: string, hashed: string): Promise<boolean> {
    const result = await bcrypt.compare(normal, hashed);
    return result;
  }
}
