import { ServiceException } from "./service.exception";

export class FileException extends ServiceException {
  message = "File exception";
}
export class NoFileGivenException extends FileException {
  message = "No file is given";
  readonly code = "F001";
}
export class FileNotFoundException extends FileException {
  message = "File not found";
  readonly code = "F002";
}
