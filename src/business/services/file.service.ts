import { Injectable } from "@nestjs/common";
import { Bucket, Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { FileObject } from "../entities/file-object.entity";
import { Repository } from "typeorm";

@Injectable()
export class FileService {
  storage: Storage;
  bucket: Bucket;
  constructor(
    @InjectRepository(FileObject) private fileRepo: Repository<FileObject>
  ) {
    this.storage = new Storage({
      projectId: process.env["GC_PROJECT_ID"],
      keyFilename: __dirname + "/../../../assets/" + process.env["GC_KEY_NAME"],
    });

    this.bucket = this.storage.bucket(process.env["GC_BUCKET_NAME"]);
  }
  /**
   * Uploads given file to storage
   * @param file file to be uploaded
   * @returns file object of the uploaded file
   * @returns -1 if no file is given
   */
  async uploadFile(file: Express.Multer.File) {
    if (!file) return -1;
    const fileName = uuidv4() + file.originalname;
    const fileObj = this.fileRepo.create();
    fileObj.name = fileName;
    await this.bucket.file(fileName).save(file.buffer);
    const url = await this.bucket.file(fileName).publicUrl();
    fileObj.url = url;
    const saved = await this.fileRepo.save(fileObj);
    return saved;
  }

  /**
   * Returns all file objects on database
   * @param page page number
   * @param take number of items to be queried
   * @returns file objects with pagination info
   */
  async getAllFileObject(page: number, take: number) {
    const skip = (page - 1) * take;
    const files = await this.fileRepo.findAndCount({
      take,
      skip,
    });
    return {
      files,
      page,
      take,
    };
  }

  /**
   * Removes file and file object by given id and returns removed file
   * @param id id of file object
   * @returns removed file object
   * @returns -1 if file object with given id not found
   */
  async removeFile(id: string) {
    const fileObj = await this.fileRepo.findOne({ where: { id } });
    if (!fileObj) return -1;

    const fileName = fileObj.name;

    await this.bucket.file(fileName).delete();

    const removed = await this.fileRepo.remove(fileObj);

    return removed;
  }

  /**
   * Returns file object with given id
   * @param id id of file object
   * @returns file object
   * @returns -1 if file object with given id not found
   */
  async getFile(id: string) {
    const fileObj = await this.fileRepo.findOne({ where: { id } });

    if (!fileObj) return -1;

    return fileObj;
  }
}
