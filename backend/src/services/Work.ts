import { randomUUID } from 'node:crypto'
import type { Work, CreateWorkRequest, UpdateWorkRequest } from '../types/works'
import type { IWorkRepository } from '../repository/works'

export class WorkService {
  constructor(private workRepo: IWorkRepository) {}

  async createWork(params: CreateWorkRequest): Promise<Work> {
    const createWorkIntent: Work = {
      id: randomUUID(),
      name: params.name,
      code: params.code ?? null,
      address: params.address,
      contractor: params.contractor ?? null,
      status: params.status ?? 'ATIVA',
    }

    await this.workRepo.create(createWorkIntent)
    const createdWork = await this.workRepo.findById(createWorkIntent.id)

    if (!createdWork) {
      throw new Error('Failed to create work')
    }

    return createdWork
  }

  async getWorkById(id: string): Promise<Work | null> {
    return await this.workRepo.findById(id)
  }

  async updateWork(
    id: string,
    updates: UpdateWorkRequest
  ): Promise<Work | null> {
    await this.workRepo.update(id, updates)
    return await this.workRepo.findById(id)
  }

  async deleteWork(id: string): Promise<void> {
    await this.workRepo.delete(id)
  }
}
