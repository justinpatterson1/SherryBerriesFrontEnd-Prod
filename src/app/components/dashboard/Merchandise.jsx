import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CgAddR } from 'react-icons/cg';
import { RxCross2 } from 'react-icons/rx';
import Loader from '../Loader.jsx';
import AddMerchandiseModule from './AddMerchandiseModule.jsx';
import Pagination from '../../components/Pagination.jsx';

function Merchandise() {
  const [merchandise, setMerchandise] = useState([]);
  const [expandedMerchandiseId, setExpandedMerchandiseId] = useState(null);
  const [formData, setFormData] = useState({});
  const { data: session, status } = useSession();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const togglemerchandise = merchandise => {
    if (expandedMerchandiseId === merchandise.id) {
      setExpandedMerchandiseId(null);
    } else {
      setExpandedMerchandiseId(merchandise.id);
      setFormData({
        name: merchandise.name || '',
        ItemType: merchandise.ItemType || '',
        isFeatured: merchandise.featured ? 'true' : 'false',
        price: merchandise.price || '',
        discount: merchandise.discount || 0,
        color: merchandise.color || '',
        description: merchandise.description || '',
        sizes: merchandise.sizes?.map(({ Size, quantity }) => ({
          Size,
          quantity
        })) || [{ Size: '', quantity: '' }]
      });
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;

    setFormData(prev => ({
      ...prev,
      sizes: updatedSizes
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...(prev.sizes || []), { Size: '', quantity: '' }]
    }));
  };

  const removeSize = index => {
    const updatedSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      sizes: updatedSizes
    }));
  };

  const fetchMerchandises = async() => {
    fetch(
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/merchandises?populate[0]=image&populate[1]=sizes&pagination[page]=${page}&pagination[pageSize]=12`
    )
      .then(res => res.json())
      .then(json => {
        if (json?.data.length !== 0) {
          setMerchandise(json?.data);
          setLoading(false);
        } else {
          setMerchandise([]);
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMerchandises();
  }, [page]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateMerchandise = async id => {
    const payload = {
      ...formData,
      sizes: formData.sizes.map(({ Size, quantity }) => ({ Size, quantity }))
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/merchandises/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${session?.jwt}`
          },
          body: JSON.stringify({ data: payload })
        }
      );

      if (res.ok) {
        fetchMerchandises();
      } else {
        alert('Failed to update merchandise.');
      }
    } catch (err) {
    }
  };

  if (status === 'loading' || loading) return <Loader />;

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>
      <div className='relative mb-6 flex justify-center items-center'>
        <h1 className='text-2xl sm:text-3xl font-bold text-center'>
          Merchandises
        </h1>
        <CgAddR
          className={`absolute right-4 sm:right-6 top-1 text-2xl hover:cursor-pointer ${openAddForm ? 'hidden' : ''}`}
          onClick={() => setOpenAddForm(!openAddForm)}
        />
        <RxCross2
          className={`absolute right-4 sm:right-6 top-1 text-2xl hover:cursor-pointer ${!openAddForm ? 'hidden' : ''}`}
          onClick={() => setOpenAddForm(!openAddForm)}
        />
      </div>

      {openAddForm && (
        <AddMerchandiseModule
          openAddForm={openAddForm}
          setOpenAddForm={setOpenAddForm}
          fetchMerchandises={fetchMerchandises}
        />
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
        {merchandise.map(merchandise => (
          <div key={merchandise.id} className='bg-white rounded-lg shadow p-4'>
            <div
              className='flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition p-2 rounded'
              onClick={() => togglemerchandise(merchandise)}
            >
              <Image
                src={
                  merchandise?.image[0]?.formats?.thumbnail?.url ||
                  merchandise?.image?.url
                }
                width={merchandise?.image[0]?.formats?.thumbnail?.width || 200}
                height={
                  merchandise?.image[0]?.formats?.thumbnail?.height || 200
                }
                alt={merchandise.name}
                className='rounded-md object-cover w-24 h-24 sm:w-32 sm:h-32'
              />
              <span className='text-lg font-semibold truncate w-full'>
                {merchandise?.name}
              </span>
            </div>

            {expandedMerchandiseId === merchandise.id && (
              <div className='mt-4 border-t pt-4 max-h-[80vh] overflow-y-auto'>
                <form className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {[
                    { label: 'Name', name: 'name' },
                    { label: 'Item Type', name: 'ItemType' },
                    { label: 'Price', name: 'price' },
                    { label: 'Color', name: 'color' },
                    { label: 'Description', name: 'description' }
                  ].map(field => (
                    <div key={field.name} className='flex flex-col'>
                      <label className='text-sm font-medium mb-1'>
                        {field.label}
                      </label>
                      <input
                        type='text'
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        className='border border-gray-300 p-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                      />
                    </div>
                  ))}

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium mb-1'>Discount</label>
                    <input
                      type='text'
                      name='discount'
                      value={formData.discount || ''}
                      onChange={handleInputChange}
                      className='border border-gray-300 p-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium mb-1'>Featured</label>
                    <select
                      name='featured'
                      value={formData.featured}
                      onChange={handleInputChange}
                      className='border border-gray-300 p-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                    >
                      <option value='true'>True</option>
                      <option value='false'>False</option>
                    </select>
                  </div>

                  <div className='col-span-full'>
                    <label className='text-sm font-medium mb-2 block'>
                      Sizes
                    </label>
                    {formData?.sizes?.map((size, index) => (
                      <div
                        key={index}
                        className='mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2'
                      >
                        <input
                          type='text'
                          placeholder='Size'
                          value={size.Size}
                          onChange={e =>
                            handleSizeChange(index, 'Size', e.target.value)
                          }
                          className='border p-2 w-full sm:w-auto'
                        />
                        <input
                          type='number'
                          placeholder='Quantity'
                          value={size.quantity}
                          onChange={e =>
                            handleSizeChange(
                              index,
                              'quantity',
                              parseInt(e.target.value)
                            )
                          }
                          className='border p-2 w-full sm:w-auto'
                        />
                        <button
                          type='button'
                          onClick={() => removeSize(index)}
                          className='text-red-500'
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type='button'
                      onClick={addSize}
                      className='mt-2 p-2 bg-blue-500 text-white rounded'
                    >
                      Add Size
                    </button>
                  </div>
                </form>

                <div className='flex justify-end mt-4'>
                  <button
                    className='w-full sm:w-auto px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition'
                    onClick={() => updateMerchandise(merchandise?.documentId)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='mt-10'>
        <Pagination page={page} setPage={setPage} length={merchandise.length} />
      </div>
    </div>
  );
}

export default Merchandise;
