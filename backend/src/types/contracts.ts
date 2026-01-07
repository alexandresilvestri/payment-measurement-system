export type Contract = {
  id: string
  workId: string
  supplierId: string
  service: string
  totalValue: number
  startDate: Date
  deliveryTime?: Date | null
  createdAt?: Date
  updatedAt?: Date
}
