import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { BiPlus, BiTrash } from "react-icons/bi";
import { useToast } from "../../context/ToastContext";


function MyProducts() {
  const { products, deleteProduct } = useProducts();
  const { storeid } = useAuth();
  const { showToast} = useToast();

  const handleDelete = (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir "${name}"?`)) {
      deleteProduct(id);
      showToast("Produto excluído com sucesso!", "success");
    }
  };

  const userProducts = products.filter(
    (product) => product.storeId === storeid,
  );

  const getStatusColor = (stock) => {
    if (stock <= 0) return "bg-red-100 text-red-800";
    if (stock < 10) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusLabel = (stock) => {
    if (stock <= 0) return "Fora de estoque";
    if (stock < 10) return "Baixo estoque";
    return "Ativo";
  };

  const getMainImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) return product.image;
    return "https://via.placeholder.com/250?text=Sem+imagem";
  };

  return (
    <div className="my-products md:w-full ">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus produtos</h1>
          <p className="text-slate-600">
            Gerencie todos os produtos da sua loja
          </p>
        </div>
        <Link
          to="/dashboard/add-product"
          className="bg-blue-600 text-white p-  rounded-lg hover:bg-blue-700 font-semibold"
        >
          <BiPlus size={36} className="sm:w-12 sm:h-12" title="Adicionar" />
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-150">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">
                Produto
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-semibold">
                Preço
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-semibold">
                Estoque
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-semibold">
                Status
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs sm:text-sm font-semibold">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {userProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-200 hover:bg-slate-50"
              >
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getMainImage(product)}
                      alt={product.name}
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded object-cover shrink-0"
                    />
                    <span className="text-sm font-medium truncate max-w-24 sm:max-w-40">{product.name}</span>
                  </div>
                </td>
                <td className="px-3 text-sm text-center py-4 font-semibold">
                  MT {Number(product.price).toFixed(2)}
                </td>
                <td className="px-3 text-sm text-center py-4">
                  {Number(product.stock || 0)} unidades
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      product.stock,
                    )}`}
                  >
                    {getStatusLabel(product.stock)}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm space-x-2">
                  <button
                    type="button"
                    onClick={()=> handleDelete(product.id,product.name)}
                    className="text-red-600 hover:underline"
                  >
                    <BiTrash size={30} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {userProducts.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg mt-6">
          <p className="text-slate-500">
            Nenhum produto encontrado. Clique em "Novo produto" para começar.
          </p>
        </div>
      )}

    </div>
  );
}

export default MyProducts;