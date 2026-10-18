import fs from 'node:fs'
import path from 'node:path'

const MODULES_SEGMENT = 'modules'
const SRC_SEGMENT = 'src'
const APP_SEGMENT = 'app'
const ALIAS = '@/modules'
const RESOLVE_SUFFIXES = [
  '',
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '/index.ts',
  '/index.tsx',
  '/index.js',
  '/index.jsx',
]

function modulesRootFrom(filePath) {
  const parts = path.resolve(filePath).split(path.sep)
  const srcIndex = parts.lastIndexOf(SRC_SEGMENT)

  if (
    srcIndex === -1 ||
    parts[srcIndex + 1] !== APP_SEGMENT ||
    parts[srcIndex + 2] !== MODULES_SEGMENT
  ) {
    return null
  }

  return parts.slice(0, srcIndex + 3).join(path.sep)
}

function featureModuleOf(filePath, modulesRoot) {
  const relative = path.relative(modulesRoot, path.resolve(filePath))

  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    return null
  }

  const [first] = relative.split(path.sep)

  if (!first) {
    return null
  }

  if (path.extname(first)) {
    return path.basename(first, path.extname(first))
  }

  return first
}

function isInsideFeatureModule(filePath, modulesRoot) {
  const relative = path.relative(modulesRoot, path.resolve(filePath))

  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    return false
  }

  return relative.split(path.sep).length > 1
}

function resolveImportedPath(fromFile, source, modulesRoot) {
  if (source === ALIAS || source.startsWith(`${ALIAS}/`)) {
    const rest = source === ALIAS ? '' : source.slice(`${ALIAS}/`.length)
    return resolveExisting(rest ? path.join(modulesRoot, rest) : modulesRoot)
  }

  if (source.startsWith('.')) {
    return resolveExisting(path.resolve(path.dirname(fromFile), source))
  }

  return null
}

function resolveExisting(candidate) {
  for (const suffix of RESOLVE_SUFFIXES) {
    const withSuffix = candidate + suffix
    if (fs.existsSync(withSuffix)) {
      return withSuffix
    }
  }

  return candidate
}

function isModulesRootImport(source) {
  return source === ALIAS || source === `${ALIAS}/`
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Impede que um módulo de feature importe outro módulo de feature.',
    },
    schema: [],
    messages: {
      crossModule:
        'Módulo "{{from}}" não pode importar o módulo "{{target}}". Use @/shared e o event bus.',
      modulesRoot:
        'Módulos de feature não podem importar @/modules. Use @/shared e o event bus.',
    },
  },
  create(context) {
    const fromFile = context.filename
    const modulesRoot = modulesRootFrom(fromFile)

    if (!modulesRoot || !isInsideFeatureModule(fromFile, modulesRoot)) {
      return {}
    }

    const fromModule = featureModuleOf(fromFile, modulesRoot)

    if (!fromModule) {
      return {}
    }

    function checkSource(sourceNode) {
      if (!sourceNode || sourceNode.type !== 'Literal') {
        return
      }

      const source = sourceNode.value

      if (typeof source !== 'string') {
        return
      }

      if (isModulesRootImport(source)) {
        context.report({ node: sourceNode, messageId: 'modulesRoot' })
        return
      }

      const importedPath = resolveImportedPath(fromFile, source, modulesRoot)

      if (!importedPath) {
        return
      }

      const targetModule = featureModuleOf(importedPath, modulesRoot)

      if (!targetModule || targetModule === fromModule) {
        return
      }

      context.report({
        node: sourceNode,
        messageId: 'crossModule',
        data: { from: fromModule, target: targetModule },
      })
    }

    return {
      ImportDeclaration(node) {
        checkSource(node.source)
      },
      ImportExpression(node) {
        checkSource(node.source)
      },
      ExportNamedDeclaration(node) {
        checkSource(node.source)
      },
      ExportAllDeclaration(node) {
        checkSource(node.source)
      },
    }
  },
}

export default rule
