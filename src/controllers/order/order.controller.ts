import { Body, Controller, Get, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AdminAuthGuard } from "src/business/guards/admin-auth.guard";
import { OrderService } from "src/business/services/order.service";
import { RequestUpdateOrderDto } from "./dto/request-update-order.dto";
import { QueryPagination } from "src/controllers/dto/query-pagination.dto";

@ApiTags("Admin Order Endpoint")
@UseGuards(AdminAuthGuard)
@Controller("order")
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getAllOrder(@Query() query: QueryPagination) {
    const orders = await this.orderService.getAllOrder(
      {},
      { take: query.take, page: query.page }
    );
    return orders;
  }

  @Patch(":id")
  async updateOrder(@Body() body: RequestUpdateOrderDto) {}
}
