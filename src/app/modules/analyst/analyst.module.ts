import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalystComponent } from './component/analyst/analyst.component';
import { AnalystRoutingModule } from './analyst-routing.module';
import { IssueAnalystComponent } from './component/issue-analyst/issue-analyst.component';
import { CoreModule } from '../core/core.module';
import { IssueLogAnalystComponent } from './component/issue-log-analyst/issue-log-analyst.component';
import { WebDataRocksPivot } from 'src/types/webdatarocks/webdatarocks.angular4';

@NgModule({
  declarations: [AnalystComponent, IssueAnalystComponent, IssueLogAnalystComponent, WebDataRocksPivot],
  exports: [],
  imports: [CommonModule, AnalystRoutingModule, CoreModule]
})
export class AnalystModule {}
