import type { JestConfigWithTsJest } from 'ts-jest'

export default <JestConfigWithTsJest>{
  preset: 'ts-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
}
