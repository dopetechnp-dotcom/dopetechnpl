"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Heart, Star, Truck, Shield, RotateCcw, ShoppingBag, X, Minus, Edit, Check, Zap, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import SupabaseCheckout from "@/components/supabase-checkout"
import { type Product, getPrimaryImageUrl, getProductImageUrls } from "@/lib/products-data"
import { ProductOptionsSelector } from "@/components/product-options-selector"
import { CartItemEditor } from "@/components/cart-item-editor"

interface ProductPageClientProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [editingCartItem, setEditingCartItem] = useState<number | null>(null)
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    updateCartItemSelections,
    getCartCount, 
    getCartTotal, 
    cartOpen, 
    setCartOpen,
    checkoutModalOpen,
    setCheckoutModalOpen,
    clearCart
  } = useCart()

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedFeatures)
    console.log('Added to cart:', product, 'Quantity:', quantity, 'Color:', selectedColor, 'Features:', selectedFeatures)
  }

  const handleBuyNow = () => {
    clearCart()
    addToCart(product, quantity, selectedColor, selectedFeatures)
    setCheckoutModalOpen(true)
    console.log('Buy now:', product, 'Quantity:', quantity, 'Color:', selectedColor, 'Features:', selectedFeatures)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Header */}
      <div className="bg-[#1a1a1a] backdrop-blur-xl border-b border-[#F7DD0F]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
                         <Button
               variant="ghost"
               onClick={() => router.back()}
               className="flex items-center gap-2 p-3 text-white hover:bg-[#F7DD0F]/10 hover:text-[#F7DD0F] transition-all duration-300 rounded-xl"
             >
               <ArrowLeft className="w-5 h-5" />
               <span className="hidden sm:inline font-medium">Back</span>
             </Button>
             
             <h1 className="text-lg lg:text-xl font-bold text-white truncate max-w-[300px] lg:max-w-none">
               {product.name}
             </h1>
             
             <Button
               variant="ghost"
               onClick={() => setCartOpen(true)}
               className="relative flex items-center gap-2 p-3 text-white hover:bg-[#F7DD0F]/10 hover:text-[#F7DD0F] transition-all duration-300 rounded-xl"
             >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Cart</span>
                             {getCartCount() > 0 && (
                 <span className="absolute -top-2 -right-2 bg-[#F7DD0F] text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                   {getCartCount()}
                 </span>
               )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-16">
          
          {/* Enhanced Product Images Section */}
          <div className="space-y-6">
            {/* Main Image with Enhanced Styling */}
            <div className="relative group">
              <div className="aspect-square max-w-md mx-auto xl:max-w-lg bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl border border-[#F7DD0F]/20 hover:border-[#F7DD0F]/40 transition-all duration-500">
                <div className="relative w-full h-full">
                  <img
                    src={getProductImageUrls(product)[selectedImage] || getPrimaryImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                {selectedImage + 1} / {getProductImageUrls(product).length}
              </div>
            </div>
            
            {/* Enhanced Thumbnail Gallery */}
            <div className="flex justify-center">
              <div className="grid grid-cols-5 gap-3 max-w-md mx-auto xl:max-w-lg">
                {getProductImageUrls(product).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
                      selectedImage === index 
                        ? 'border-yellow-500 shadow-lg ring-2 ring-yellow-500/30 scale-105' 
                        : 'border-gray-600 hover:border-yellow-500/50 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Product Details Section */}
          <div className="space-y-8 max-w-md">
            {/* Product Title */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                {product.name}
              </h1>
            </div>

                          {/* Enhanced Price Section */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-5xl font-bold text-[#F7DD0F]">
                    Rs {product.discount > 0 ? Math.round(product.original_price * (1 - product.discount / 100)).toLocaleString() : product.price.toLocaleString()}
                  </span>
                  {(product.original_price > product.price || product.discount > 0) && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-gray-400 line-through">
                        Rs {product.original_price.toLocaleString()}
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                        {product.discount > 0 ? product.discount : Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
              

            </div>

            {/* Enhanced Description */}
            <div className="bg-[#1a1a1a] backdrop-blur-sm p-6 rounded-2xl border border-[#F7DD0F]/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F7DD0F]" />
                Product Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description || "Experience premium quality with our latest product. Designed for performance and durability, this item offers exceptional value and modern aesthetics."}
              </p>
            </div>

            {/* Product Options Selector */}
            <ProductOptionsSelector
              product={product}
              onOptionsChange={(color, features) => {
                setSelectedColor(color)
                setSelectedFeatures(features)
              }}
              initialColor={selectedColor}
              initialFeatures={selectedFeatures}
            />

            {/* Enhanced Quantity Selector */}
            <div className="space-y-4">
              <label className="text-lg font-semibold text-white">
                Quantity
              </label>
                             <div className="w-full max-w-48">
                 <div className="grid grid-cols-3 border-2 border-[#F7DD0F]/30 rounded-lg bg-[#1a1a1a] backdrop-blur-sm focus-within:border-[#F7DD0F]/60 focus-within:ring-2 focus-within:ring-[#F7DD0F]/20 transition-all duration-300 overflow-hidden">
                   <button
                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
                     className="px-3 py-2 text-white hover:text-[#F7DD0F] hover:bg-[#F7DD0F]/20 active:bg-[#F7DD0F]/30 transition-all duration-300 text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                     disabled={quantity <= 1}
                   >
                     -
                   </button>
                   <input
                     type="number"
                     value={quantity}
                     onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                     className="text-center border-none bg-transparent focus:outline-none text-base font-bold text-white px-2 py-2"
                     min="1"
                   />
                   <button
                     onClick={() => setQuantity(quantity + 1)}
                     className="px-3 py-2 text-white hover:text-[#F7DD0F] hover:bg-[#F7DD0F]/20 active:bg-[#F7DD0F]/30 transition-all duration-300 text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 bg-transparent"
                   >
                     +
                   </button>
                 </div>
               </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleBuyNow}
                className="w-full sm:flex-1 bg-[#F7DD0F] hover:bg-[#F7DD0F]/90 text-black py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-[#F7DD0F]/30"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Enhanced Service Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] backdrop-blur-sm p-6 rounded-2xl border border-[#F7DD0F]/20 hover:border-[#F7DD0F]/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#F7DD0F]/20 rounded-lg">
                    <RotateCcw className="w-5 h-5 text-[#F7DD0F]" />
                  </div>
                  <span className="font-semibold text-white">Return & Refund Policy</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Safe payments and secure personal details with 30-day return guarantee
                </p>
              </div>
              <div className="bg-[#1a1a1a] backdrop-blur-sm p-6 rounded-2xl border border-[#F7DD0F]/20 hover:border-[#F7DD0F]/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#F7DD0F]/20 rounded-lg">
                    <Shield className="w-5 h-5 text-[#F7DD0F]" />
                  </div>
                  <span className="font-semibold text-white">Security & Privacy</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Safe payments and secure personal details with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Related Products Section */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Related Products
            </h2>
            <p className="text-gray-400">Discover more amazing products</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                onClick={() => router.push(`/product/${relatedProduct.id}`)}
                className="bg-[#1a1a1a] backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-[#F7DD0F]/20 hover:border-[#F7DD0F]/40 focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 active:scale-[0.98]"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(`/product/${relatedProduct.id}`)
                  }
                }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getPrimaryImageUrl(relatedProduct)}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white line-clamp-2 mb-2 leading-tight group-hover:text-[#F7DD0F] transition-colors duration-300">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-lg font-bold text-[#F7DD0F] group-hover:scale-105 transition-transform duration-300">
                    Rs {relatedProduct.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Shopping Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          
          <div className="relative ml-auto w-full max-w-sm sm:max-w-md bg-gradient-to-br from-gray-900 to-black shadow-2xl rounded-l-3xl border-l border-yellow-500/20">
            <div className="flex flex-col h-full">
              {/* Enhanced Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-yellow-500/20">
                <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-3 hover:bg-yellow-500/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Enhanced Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Your cart is empty</p>
                    <p className="text-gray-500 text-sm mt-2">Add some products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 space-y-4 border border-yellow-500/20">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm line-clamp-2 leading-tight text-white">{item.name}</h3>
                            <p className="text-yellow-400 font-bold text-base">Rs {item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setEditingCartItem(item.id)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {(item.selectedColor || (item.selectedFeatures && item.selectedFeatures.length > 0)) && (
                          <div className="pl-20 space-y-2">
                            {item.selectedColor && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400">Color:</span>
                                <span className="text-xs font-medium text-white">{item.selectedColor}</span>
                              </div>
                            )}
                            {item.selectedFeatures && item.selectedFeatures.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400">Features:</span>
                                <span className="text-xs font-medium text-white">{item.selectedFeatures.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-yellow-500/20 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                      Rs {getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setCartOpen(false)
                      setCheckoutModalOpen(true)
                    }}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-4 px-6 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Supabase Checkout Modal */}
      <SupabaseCheckout
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cart={cart}
        total={getCartTotal()}
        onCartReset={() => {
          // Cart will be cleared by the SupabaseCheckout component
        }}
      />

      {/* Cart Item Editor Modal */}
      {editingCartItem && (() => {
        const item = cart.find(cartItem => cartItem.id === editingCartItem)
        if (!item) return null
        
        return (
          <CartItemEditor
            product={item}
            currentColor={item.selectedColor}
            currentFeatures={item.selectedFeatures}
            onSave={(color, features) => {
              updateCartItemSelections(editingCartItem, color, features)
              setEditingCartItem(null)
            }}
            onCancel={() => setEditingCartItem(null)}
            isOpen={true}
          />
        )
      })()}
    </div>
  )
}
