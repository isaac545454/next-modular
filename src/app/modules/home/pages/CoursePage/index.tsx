'use client'

import { StatusMessage } from '@/shared/ui/StatusMessage'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { DefinitionList } from '@/shared/ui/DefinitionList'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageSection } from '@/shared/ui/PageSection'
import { TextLink } from '@/shared/ui/TextLink'
import { CourseSyllabus } from '../../components/CourseSyllabus'
import { useCoursePage } from './useCoursePage'

export function CoursePage() {
  const { userId, isPending, isError, course, errorMessage, refetch } = useCoursePage()

  if (isPending) {
    return (
      <PageSection>
        <PageHeader kicker="Catálogo" title="Curso" />
        <StatusMessage tone="loading">Carregando curso…</StatusMessage>
      </PageSection>
    )
  }

  if (isError) {
    return (
      <PageSection>
        <PageHeader kicker="Catálogo" title="Curso" />
        <StatusMessage tone="error">{errorMessage}</StatusMessage>
        <Button onClick={refetch}>Tentar novamente</Button>
      </PageSection>
    )
  }

  if (!course) {
    return (
      <PageSection>
        <PageHeader kicker="Catálogo" title="Curso não encontrado" />
        <StatusMessage tone="empty">Esse id não está no catálogo simulado.</StatusMessage>
        <TextLink to="/">Voltar ao catálogo</TextLink>
      </PageSection>
    )
  }

  return (
    <PageSection>
      <PageHeader kicker="Catálogo" title={course.title} description={course.summary} />
      {course.level ? <Badge>{course.level}</Badge> : null}
      <DefinitionList
        items={[
          ...(course.hours ? [{ term: 'Carga', description: course.hours }] : []),
          ...(course.priceLabel ? [{ term: 'Preço', description: course.priceLabel }] : []),
          ...(course.audience ? [{ term: 'Para quem', description: course.audience }] : []),
        ]}
      />
      {course.syllabus && course.syllabus.length > 0 ? (
        <CourseSyllabus items={course.syllabus} />
      ) : null}
      <div className="flex flex-wrap gap-3">
        <TextLink to="/">Voltar ao catálogo</TextLink>
        {userId ? (
          <TextLink variant="button" to="/checkout">
            Ir ao checkout
          </TextLink>
        ) : (
          <TextLink variant="button" to="/login">
            Entrar para assinar
          </TextLink>
        )}
      </div>
    </PageSection>
  )
}
