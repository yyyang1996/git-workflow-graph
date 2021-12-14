import React from 'react'
import type { GitgraphUserApi } from '@gitgraph/core'

export const workflowA = (gitgraph: GitgraphUserApi<React.ReactSVGElement>) => {
  const master = gitgraph.branch('master')
  master.commit('某个 commit')
  master.tag('v1.0.0')

  const v1 = gitgraph.branch({ name: 'v1.1.0', from: master })
  const featA = gitgraph.branch({ name: 'feat-a', from: v1 })
  const featB = gitgraph.branch({ name: 'feat-b', from: v1 })

  featA.commit('从 v1.1.0 切出 feat-a, 提交了一些东西')

  featB.commit('从 v1.1.0 切出 feat-b, 提交了一些东西')
  featB.commit('feat: feab-b 的某个功能')

  featB.tag('feat-b 提测')

  featA.commit('feat: feat-a 的某个功能')
  featA.tag('feat-a 提测')

  const hotfix = gitgraph.branch({ name: 'hotfix', from: master })
  hotfix.commit('从 master 切出 hotfix, 修复了 xxx')
  master.merge(hotfix, 'master 分支合并 hotfix')

  master.tag('v1.0.1')

  v1.merge(master, 'v1.1.0 合并/rebase master')
  v1.merge(featB, 'feat-b 测试完成, v1.1.0 合并 feat-b')

  featA.commit('feat-a 提测时 bug, 提交 fix')
  v1.merge(featA, 'feat-a 测试完成, v1.1.0 合并 feat-a')


  const fixB = gitgraph.branch({ name: 'fix-b', from: v1 })
  fixB.commit('集成测试期间发现 bug, 从 master 切出 fix-b 分支并修复')
  v1.merge(fixB, 'v1.1.0 合并 fix-b 分支')

  master.merge(v1, 'master 合并 v1.1.0')
  master.tag('v1.1.0')
}

export const workflowB = (gitgraph: GitgraphUserApi<React.ReactSVGElement>) => {
  const master = gitgraph.branch('master')
  const release = gitgraph.branch('release')
  master.commit('某个 commit')

  release.merge(master, 'release 分支合并 master')
  release.tag('v1.0.0')

  const featA = gitgraph.branch({ name: 'feat-a', from: master })
  const featB = gitgraph.branch({ name: 'feat-b', from: master })

  featA.commit('从 master 切出 feat-a, 提交了一些东西')

  featB.commit('从 master 切出 feat-b, 提交了一些东西')

  featB.commit('feat: feab-b 的某个功能')
  featB.tag('feat-b 提测')

  featA.commit('feat: feat-a 的某个功能')
  featA.tag('feat-a 提测')

  const hotfix = gitgraph.branch({ name: 'hotfix', from: release })
  hotfix.commit('从 release 切出 hotfix, 修复了 xxx')
  release.merge(hotfix, 'release 分支合并 hotfix')

  release.tag('v1.0.1')
  master.merge(release, 'master 合并/rebase release')

  master.merge(featB, 'feat-b 测试完成, master 合并 feat-b')

  featA.commit('feat-a 提测时 bug, 提交 fix')

  master.merge(featA, 'feat-a 测试完成, master 合并 feat-a')


  const fixB = gitgraph.branch({ name: 'fix-b', from: master })
  fixB.commit('集成测试期间发现 bug, 从 master 切出 fix-b 分支并修复')
  master.merge(fixB, 'master 合并集成测试的 fix 分支')

  release.merge(master, 'release 合并 master')
  release.tag('v1.1.0')
}
