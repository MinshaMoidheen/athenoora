'use server'

import { revalidatePath } from 'next/cache'

export async function addItem(formData: FormData) {
  try {
    // Extract form data
    const itemName = formData.get('itemName') as string
    const itemHSN = formData.get('itemHSN') as string
    const category = formData.get('category') as string
    const itemCode = formData.get('itemCode') as string
    const baseUnit = formData.get('baseUnit') as string
    const secondaryUnit = formData.get('secondaryUnit') as string
    const salePrice = formData.get('salePrice') as string
    const saleTaxType = formData.get('saleTaxType') as string
    const discountOnSale = formData.get('discountOnSale') as string
    const discountType = formData.get('discountType') as string
    const wholesalePrice = formData.get('wholesalePrice') as string
    const wholesaleTaxType = formData.get('wholesaleTaxType') as string
    const minWholesaleQty = formData.get('minWholesaleQty') as string
    const purchasePrice = formData.get('purchasePrice') as string
    const purchaseTaxType = formData.get('purchaseTaxType') as string
    const taxRate = formData.get('taxRate') as string
    const openingQuantity = formData.get('openingQuantity') as string
    const atPrice = formData.get('atPrice') as string
    const asOfDate = formData.get('asOfDate') as string
    const minStockToMaintain = formData.get('minStockToMaintain') as string
    const location = formData.get('location') as string
    const imageCount = parseInt(formData.get('imageCount') as string) || 0

    // Validate required fields
    if (!itemName) {
      return { error: 'Item name is required' }
    }

    // Handle uploaded images
    const images: File[] = []
    for (let i = 0; i < imageCount; i++) {
      const image = formData.get(`image_${i}`) as File
      if (image) {
        images.push(image)
      }
    }

    // Here you would typically save to database
    // For now, we'll just simulate success
    console.log('Adding item:', {
      itemName,
      itemHSN,
      category,
      itemCode,
      baseUnit,
      secondaryUnit,
      salePrice,
      saleTaxType,
      discountOnSale,
      discountType,
      wholesalePrice,
      wholesaleTaxType,
      minWholesaleQty,
      purchasePrice,
      purchaseTaxType,
      taxRate,
      openingQuantity,
      atPrice,
      asOfDate,
      minStockToMaintain,
      location,
      images: images.map(img => ({
        name: img.name,
        size: img.size,
        type: img.type
      })),
      imageCount: images.length
    })

    // Revalidate the items page
    revalidatePath('/items')

    return { success: true, message: 'Item added successfully' }
  } catch (error) {
    console.error('Error adding item:', error)
    return { error: 'Failed to add item' }
  }
}

export async function updateItem(id: string, formData: FormData) {
  try {
    // Similar implementation for updating item
    console.log('Updating item:', id, formData)
    
    revalidatePath('/items')
    return { success: true, message: 'Item updated successfully' }
  } catch (error) {
    console.error('Error updating item:', error)
    return { error: 'Failed to update item' }
  }
}

export async function deleteItem(id: string) {
  try {
    // Similar implementation for deleting item
    console.log('Deleting item:', id)
    
    revalidatePath('/items')
    return { success: true, message: 'Item deleted successfully' }
  } catch (error) {
    console.error('Error deleting item:', error)
    return { error: 'Failed to delete item' }
  }
}
