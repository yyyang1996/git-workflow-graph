import { useState } from 'react'
import { Gitgraph, Orientation, TemplateName, GitgraphProps } from '@gitgraph/react'
// import { workflowA, workflowB } from './workflow'
import './App.css'

function CompareBranchesOrder(branchNameA: string, branchNameB: string) {
  const orderMap: Record<string, number> = {
    'hotfix': 1,
    'master': 10,
    'release': 20,
    'v1.1.0': 20,
    'feat-a': 30,
    'feat-b': 40,
    'fix-a': 50,
    'fix-b': 60
  }

  return (orderMap[branchNameA] - orderMap[branchNameB]) || 0
}

function App() {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh', paddingTop: 100 }}>
      <Gitgraph
        options={{
          template: TemplateName.BlackArrow,
          author: 'yhj <yhj@gmail.com>',
          branchLabelOnEveryCommit: true,
          compareBranchesOrder: CompareBranchesOrder,
          // orientation: Orientation.Horizontal
        }}
      >
        {(gitgraph) => {
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
          v1.merge(featB, 'v1.1.0 合并 feat-b')

          featA.commit('feat-a 提测时 bug, 提交 fix')
          v1.merge(featA, 'v1.1.0 合并 feat-a')


          const fixB = gitgraph.branch({ name: 'fix-b', from: v1 })
          fixB.commit('集成测试期间发现 bug, 从 master 切出 fix-b 分支并修复')
          v1.merge(fixB, 'v1.1.0 合并 fix-b 分支')

          master.merge(v1, 'master 合并 v1.1.0')
          master.tag('v1.1.0')
        }}
      </Gitgraph>
    </div>
  )
}

export default App
