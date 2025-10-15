import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { OrganizationService } from './organizations.service';
import { CreateOrganizationDto } from './dto/organization.dto';
import { UpdateOrganizationDto } from './dto/organization.dto';

type RequestWithUser = Request & { user: any };

@Controller('organizations') 
@UseGuards(JwtAuthGuard, PermissionGuard)
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @RequirePermission('org:manage')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrgDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrgDto);
  }

  @Get()
  @RequirePermission('org:read') 
  async findAll(@Req() req: RequestWithUser) {
    return this.organizationService.findAllScoped(req.user);
  }

  @Put(':id')
  @RequirePermission('org:manage')
  async update(@Param('id') id: number, @Body() updateOrgDto: UpdateOrganizationDto) {
    return this.organizationService.update(id, updateOrgDto);
  }

  @Delete(':id')
  @RequirePermission('org:manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.organizationService.remove(id);
  }
}