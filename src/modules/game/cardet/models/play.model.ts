import { IsInt } from 'class-validator'

export class PlayModel {
  @IsInt({ each: true })
  public indices: number[] = []
}
