import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
import { QueryPagination } from "src/controllers/dto/query-pagination.dto";

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
  @ApiBadRequestResponse(errorApiInfo(["EMPTY_FILE_GIVEN"]))
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ResponseUploadFileDto> {
    const fileObj = await this.fileService.uploadFile(file);

    return {
      uploaded: fileObj,
    };
  }
  @ApiOkResponse({
    type: ResponseAllFileDto,
    description: " Returns all file object with given pagination  ",
  })
  @ApiBadRequestResponse(errorApiInfo(["PAGE_AND_TAKE_INVALID"]))
  @Get("all")
  async getAllFiles(
    @Query() query: QueryPagination
  ): Promise<ResponseAllFileDto> {
    const files = await this.fileService.getAllFileObject(
      query.page,
      query.take
    );

    return this.utilityService.paginateResponse(
      files.files,
      query.page,
      query.take
    );
  }

  @ApiOkResponse({
    type: ResponseFileDto,
    description: "Returns file object with given id",
  })
  @ApiBadRequestResponse(errorApiInfo(["FILE_NOT_FOUND"]))
  @Get("one/:id")
  async getFile(@Param() params: any): Promise<ResponseFileDto> {
    const file = await this.fileService.getFile(params.id);

    return file;
  }

  @ApiOkResponse({
    type: ResponseRemoveFileDto,
    description:
      "Removes both item metadata on database and on external storage",
  })
  @ApiBadRequestResponse(errorApiInfo(["FILE_NOT_FOUND"]))
  @Delete(":id")
  async removeFile(@Param() params: any): Promise<ResponseRemoveFileDto> {
    const removed = await this.fileService.removeFile(params.id);

    return {
      removed,
    };
  }
}
