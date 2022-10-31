export interface IShift {
  'shiftId': string
  'name': string
  'startTime': string
  'endTime': string
  'duration': number
  'shiftDate': string
  'ifSenior': number
  'remark': string
}

export interface IPerson {
  'personId': string
  'hireDate': string
  'terminationDate'?: null
  'name': string
  'employeeId': string
  'orgCode': string
  'positionCode'?: null
  'shiftList': IShift[]
  'lockDateList': string[]
  'totalDuration': number
  'totalWorkDays': number
  'totalRestDays': number
}
