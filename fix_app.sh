sed -i '' '/const handleOpenAddUnit = () => {/d' src/App.tsx
sed -i '' '/const handleOpenEditUnit = (unit: Unit) => {/d' src/App.tsx
sed -i '' '/const handleOpenAddFormula = (unitId?: string) => {/d' src/App.tsx
sed -i '' '/const handleOpenImage = (imageUrl: string, title: string) => {/d' src/App.tsx
sed -i '' '/\/\/ Actions/a\
  const handleOpenAddUnit = () => {\
    setEditingUnit(null);\
    setIsUnitModalOpen(true);\
  };\
  const handleOpenEditUnit = (unit: Unit) => {\
    setEditingUnit(unit);\
    setIsUnitModalOpen(true);\
  };\
  const handleOpenAddFormula = (unitId?: string) => {\
    setEditingFormula(null);\
    setFormulaModalUnitId(unitId || selectedUnitId || units[0]?.id);\
    setIsFormulaModalOpen(true);\
  };\
  const handleOpenImage = (imageUrl: string, title: string) => {\
    setLightboxImageUrl(imageUrl);\
    setLightboxTitle(title);\
  };\
' src/App.tsx
