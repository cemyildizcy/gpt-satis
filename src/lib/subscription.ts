export interface SubscriptionInfo {
  isActive: boolean
  isExpired: boolean
  isPending: boolean
  remainingDays: number
  remainingHours: number
  remainingMinutes: number
  remainingSeconds: number
  totalRemainingMs: number
  endDate: Date | null
  startDate: Date | null
  isExpiringSoon: boolean // 3 gün veya daha az kaldıysa
}

export function calculateSubscription(
  status: string,
  subscriptionStart: Date | null,
  subscriptionEnd: Date | null
): SubscriptionInfo {
  const now = new Date()

  if (!subscriptionEnd || !subscriptionStart) {
    return {
      isActive: false,
      isExpired: false,
      isPending: status === 'PENDING',
      remainingDays: 0,
      remainingHours: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      totalRemainingMs: 0,
      endDate: null,
      startDate: null,
      isExpiringSoon: false,
    }
  }

  const totalRemainingMs = subscriptionEnd.getTime() - now.getTime()
  const isExpired = totalRemainingMs <= 0 || status === 'EXPIRED'
  const isActive = !isExpired && status === 'ACTIVE'

  if (isExpired) {
    return {
      isActive: false,
      isExpired: true,
      isPending: false,
      remainingDays: 0,
      remainingHours: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      totalRemainingMs: 0,
      endDate: subscriptionEnd,
      startDate: subscriptionStart,
      isExpiringSoon: false,
    }
  }

  const remainingDays = Math.floor(totalRemainingMs / (1000 * 60 * 60 * 24))
  const remainingHours = Math.floor(
    (totalRemainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const remainingMinutes = Math.floor(
    (totalRemainingMs % (1000 * 60 * 60)) / (1000 * 60)
  )
  const remainingSeconds = Math.floor(
    (totalRemainingMs % (1000 * 60)) / 1000
  )

  return {
    isActive,
    isExpired: false,
    isPending: status === 'PENDING',
    remainingDays,
    remainingHours,
    remainingMinutes,
    remainingSeconds,
    totalRemainingMs,
    endDate: subscriptionEnd,
    startDate: subscriptionStart,
    isExpiringSoon: remainingDays <= 3,
  }
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}
