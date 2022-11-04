export function getDatas(counts: number) {
  const data = []
  for (let index = 0; index < counts; index++) {
    data.push({
      id: String(index),
      text: Math.random().toString(16).slice(8),
    })
  }
  return data
}
