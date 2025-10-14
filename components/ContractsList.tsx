'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ContractCard from './ContractCard'
import DeleteContractModal from './DeleteContractModal'

interface ContractsListProps {
  initialContracts: any[]
}

export default function ContractsList({ initialContracts }: ContractsListProps) {
  const [contracts, setContracts] = useState(initialContracts)
  const [deleteModal, setDeleteModal] = useState<{ id: string; filename: string } | null>(null)
  const router = useRouter()

  const handleDeleteClick = (contractId: string, filename: string) => {
    setDeleteModal({ id: contractId, filename })
  }

  const handleDeleteConfirm = () => {
    // Remove from local state
    setContracts(prev => prev.filter(c => c.id !== deleteModal?.id))
    setDeleteModal(null)
    router.refresh()
  }

  return (
    <>
      <div className="grid gap-4">
        {contracts.map((contract: any) => (
          <ContractCard 
            key={contract.id}
            contract={contract}
            onDeleteClick={() => handleDeleteClick(contract.id, contract.filename)}
          />
        ))}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteContractModal
          contractId={deleteModal.id}
          filename={deleteModal.filename}
          onDelete={handleDeleteConfirm}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </>
  )
}

