import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AdminAuthGuard } from "src/business/guards/admin-auth.guard";
import { FileService } from "src/business/services/file.service";
import { UtilityService } from "src/business/services/utility.service";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
import { ResponseUploadFileDto } from "./dto/response-upload-file.dto";
import { ResponseAllFileDto } from "./dto/response-all-file.dto";
import { ResponseFileDto } from "./dto/response-file.dto";
import { ResponseRemoveFileDto } from "./dto/response-remove-file.dto copy";

@ApiTags("Admin File Setters")
@UseGuards(AdminAuthGuard)
@Controller("file")
export class FileControler {
  constructor(
    private fileService: FileService,
    private utilityService: UtilityService
  ) {}

  @ApiOkResponse({
    type: ResponseUploadFileDto,
    description:
      "Upload file to external storage service and return its mirror file object containing information",
  })
  @ApiBadRequestResponse(errorApiInfo(["F001"]))
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResponseUploadFileDto> {
    const fileObj = await this.fileService.uploadFile(file);

    if (fileObj === -1) throw new BadRequestException(customError("F001"));

    return {
      uploaded: fileObj,
    };
  }
  @ApiOkResponse({
    type: ResponseAllFileDto,
    description: " Returns all file object with given pagination  ",
  })
  @ApiBadRequestResponse(errorApiInfo(["Q001"]))
  @Get("all/:page/:size")
  async getAllFiles(@Param() params: any): Promise<ResponseAllFileDto> {
    const page = Number(params.page);
    const take = Number(params.size);
    if (isNaN(page) || isNaN(take))
      throw new BadRequestException(customError("Q001"));
    const files = await this.fileService.getAllFileObject(page, take);

    return this.utilityService.paginateResponse(files.files, page, take);
  }

  @ApiOkResponse({
    type: ResponseFileDto,
    description: "Returns file object with given id",
  })
  @ApiBadRequestResponse(errorApiInfo(["F002"]))
  @Get("one/:id")
  async getFile(@Param() params: any): Promise<ResponseFileDto> {
    const file = await this.fileService.getFile(params.id);

    if (file === -1) throw new BadRequestException(customError("F002"));

    return file;
  }

  @ApiOkResponse({
    type: ResponseRemoveFileDto,
    description:
      "Removes both item metadata on database and on external storage",
  })
  @ApiBadRequestResponse(errorApiInfo(["F002"]))
  @Delete(":id")
  async removeFile(@Param() params: any): Promise<ResponseRemoveFileDto> {
    const removed = await this.fileService.removeFile(params.id);

    if (removed === -1) throw new BadRequestException(customError("F002"));

    return {
      removed,
    };
  }
}
