import { Request, Response } from 'express'
import { workService } from '../services/instances'
import { NotFoundError } from '../errors'
import { asyncHandler } from '../utils/asyncHandler'
import { UpdateWorkRequest } from '../types/api/works'

export const createWorkHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const work = await workService.createWork(req.body)
    res.status(201).json(work)
  }
)

export const getWorkHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const work = await workService.getWorkById(req.params.id)

    if (!work) {
      throw new NotFoundError(`Work with id ${req.params.id} does not exist`)
    }

    res.status(200).json(work)
  }
)

export const updateWorkHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const updates = req.body as UpdateWorkRequest
    const work = await workService.updateWork(id, updates)

    if (!work) {
      throw new NotFoundError(`Work with id ${req.params.id} does not exist`)
    }

    res.status(200).json(work)
  }
)

export const deleteWorkHandler = asyncHandler(
  async (req: Request, res: Response) => {
    await workService.deleteWork(req.params.id)
    res.status(204).send()
  }
)
