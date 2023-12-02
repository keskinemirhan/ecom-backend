import { ServiceException } from "./service.exception";

export class FileException extends ServiceException {
  message = "File exception";
}
export class NoFileGivenException extends FileException {
  message = "No file is given";
}
export class FileNotFoundException extends FileException {
  message = "File not found";
}
