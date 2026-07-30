import { CreatePostDto, POST_LIMITS } from '@tcit/shared';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** Valida el payload de `POST /api/posts` contra el contrato compartido. */
export class CreatePostRequest implements CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(POST_LIMITS.nameMaxLength)
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MaxLength(POST_LIMITS.descriptionMaxLength)
  description!: string;
}
