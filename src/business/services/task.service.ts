import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AccountService } from "./account.service";
import { UtilityService } from "./utility.service";

@Injectable()
export class TaskService {
  private readonly dayLimit = Number(process.env["UNVERIFIED_DAYS_LIMIT"]) || 5;
  constructor(
    private accountService: AccountService,
    private utilityService: UtilityService
  ) {}

  /**
   * To remove unverified accounts that exists outside
   * of the stated day limit
   */
  @Cron(CronExpression.EVERY_DAY_AT_2PM)
  async removeUnverifiedAccounts() {
    try {
      const unverifiedAccounts = await this.accountService.getAllUser({
        where: { verified: false },
      });
      const now = new Date();
      for (const account of unverifiedAccounts) {
        const dayDifference = this.utilityService.getDayDifference(
          now,
          account.createdAt
        );

        if (dayDifference > this.dayLimit)
          await this.accountService.removeUser({ where: { id: account.id } });
      }
    } catch {}
  }
}
