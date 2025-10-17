import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { useAddHotelRoomMutation } from '../../../../../redux/api/hotel/createHotelRoomApi';
import Swal from 'sweetalert2';

export default function CreateHotelRoom() {
  const [loading, setLoading] = useState(false);
  const [hotelImages, setHotelImages] = useState([]);
  const [addHotelRoom] = useAddHotelRoomMutation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      hotelRoomType: 'Deluxe Suite',
      hotelAC: true,
      hotelParking: true,
      hotelWifi: true,
      hotelBreakfast: true,
      hotelPool: false,
      hotelRating: '4.5',
      hotelSmoking: false,
      hotelTv: true,
      hotelWashing: true,
      hotelRoomDescription: 'A spacious deluxe suite with ocean view and modern amenities.',
      hotelAddress: '123 Beach Avenue',
      hotelCity: 'Miami',
      hotelPostalCode: '33101',
      hotelDistrict: 'Downtown',
      hotelCountry: 'USA',
      hotelRoomCapacity: '3 Adults',
      hotelNumberOfRooms: 5,
      hotelNumAdults: 2,
      hotelNumChildren: 1,
      hotelAccommodationType: 'Suite',
      hotelKitchen: true,
      hotelRestaurant: true,
      hotelGym: true,
      hotelSpa: false,
      hotel24HourFrontDesk: true,
      hotelAirportShuttle: false,
      hotelNoSmokingPreference: true,
      hotelNoNSmoking: true,
      hotelPetsAllowed: false,
      hotelNoPetsPreferences: true,
      hotelPetsNotAllowed: true,
      hotelLocationFeatureWaterView: true,
      hotelLocationFeatureIsland: false,
      hotelCoffeeBar: true,
      hotelRoomPriceNight: 150,
      category: 'Luxury',
      discount: 10.5,
      hotelReviewCount: 12
    }
  });

  const hotelId = '68f163edef9dbb810f5475ba';

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setHotelImages([...hotelImages, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...hotelImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setHotelImages(newImages);
  };

const onSubmit = async (data) => {
  setLoading(true);
  try {
    const formData = new FormData();
    
    // Append all form data except files
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'hotelRoomImages') {
        formData.append(key, value);
      }
    });
    
    // Append images
    hotelImages.forEach((image) => {
      formData.append('hotelRoomImages', image.file);
    });

    // Show loading state
    Swal.fire({
      title: 'Creating Room',
      text: 'Please wait while we create your hotel room...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const response = await addHotelRoom({ formData, hotelId }).unwrap();
    
    // Close the loading dialog
    Swal.close();
    
    // Show success message
    await Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: response.message || 'Hotel room created successfully!',
      confirmButtonText: 'View Rooms'
    });

    navigate('/dashboard/hotel-management');
    
  } catch (error) {
    console.error('Error creating hotel room:', error);
    // Close any open dialogs
    Swal.close();
    
    // Show error message
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.data?.message || 'Failed to create hotel room. Please try again.'
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Hotel Room</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Room Information Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Room Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Type</label>
              <input
                type="text"
                {...register('hotelRoomType', { required: 'Room type is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.hotelRoomType && (
                <p className="mt-1 text-sm text-red-600">{errors.hotelRoomType.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Price per Night ($)</label>
              <input
                type="number"
                step="0.01"
                {...register('hotelRoomPriceNight', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.hotelRoomPriceNight && (
                <p className="mt-1 text-sm text-red-600">{errors.hotelRoomPriceNight.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Rooms</label>
              <input
                type="number"
                {...register('hotelNumberOfRooms', { 
                  required: 'Number of rooms is required',
                  min: { value: 1, message: 'At least one room is required' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.hotelNumberOfRooms && (
                <p className="mt-1 text-sm text-red-600">{errors.hotelNumberOfRooms.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Capacity</label>
              <select
                {...register('hotelRoomCapacity')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="1 Adult">1 Adult</option>
                <option value="2 Adults">2 Adults</option>
                <option value="3 Adults">3 Adults</option>
                <option value="4 Adults">4 Adults</option>
                <option value="4+ Adults">4+ Adults</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Adults</label>
              <input
                type="number"
                min="1"
                {...register('hotelNumAdults', { required: 'Number of adults is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Children</label>
              <input
                type="number"
                min="0"
                {...register('hotelNumChildren')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Accommodation Type</label>
              <select
                {...register('hotelAccommodationType')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="Suite">Suite</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Room Description</label>
            <textarea
              {...register('hotelRoomDescription', { required: 'Description is required' })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.hotelRoomDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.hotelRoomDescription.message}</p>
            )}
          </div>
        </div>

        {/* Amenities Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { id: 'hotelAC', label: 'Air Conditioning' },
              { id: 'hotelWifi', label: 'Free WiFi' },
              { id: 'hotelTv', label: 'TV' },
              { id: 'hotelBreakfast', label: 'Breakfast Included' },
              { id: 'hotelParking', label: 'Parking' },
              { id: 'hotelPool', label: 'Swimming Pool' },
              { id: 'hotelKitchen', label: 'Kitchen' },
              { id: 'hotelWashing', label: 'Washing Machine' },
              { id: 'hotelRestaurant', label: 'Restaurant' },
              { id: 'hotelGym', label: 'Gym' },
              { id: 'hotelSpa', label: 'Spa' },
              { id: 'hotel24HourFrontDesk', label: '24-Hour Front Desk' },
              { id: 'hotelAirportShuttle', label: 'Airport Shuttle' },
              { id: 'hotelCoffeeBar', label: 'Coffee Bar' },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center">
                <input
                  type="checkbox"
                  id={id}
                  {...register(id)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor={id} className="ml-2 text-sm text-gray-700">
                  {label}
                </label>
              </div>
            ))}
          </div>

          {/* Smoking & Pet Policies */}
          <h3 className="text-md font-semibold mt-6 mb-3">Smoking & Pet Policies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { id: 'hotelNoSmokingPreference', label: 'No Smoking Preference' },
              { id: 'hotelNoNSmoking', label: 'No Smoking' },
              { id: 'hotelPetsAllowed', label: 'Pets Allowed' },
              { id: 'hotelNoPetsPreferences', label: 'No Pets Preference' },
              { id: 'hotelPetsNotAllowed', label: 'Pets Not Allowed' },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center">
                <input
                  type="checkbox"
                  id={id}
                  {...register(id)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor={id} className="ml-2 text-sm text-gray-700">
                  {label}
                </label>
              </div>
            ))}
          </div>

          {/* Location Features */}
          <h3 className="text-md font-semibold mt-6 mb-3">Location Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { id: 'hotelLocationFeatureWaterView', label: 'Water View' },
              { id: 'hotelLocationFeatureIsland', label: 'Island Location' },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center">
                <input
                  type="checkbox"
                  id={id}
                  {...register(id)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor={id} className="ml-2 text-sm text-gray-700">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                {...register('hotelAddress', { required: 'Address is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.hotelAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.hotelAddress.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                {...register('hotelCity', { required: 'City is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.hotelCity && (
                <p className="mt-1 text-sm text-red-600">{errors.hotelCity.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                {...register('hotelPostalCode', { required: 'Postal code is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.hotelPostalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.hotelPostalCode.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                {...register('hotelCountry', { required: 'Country is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.hotelCountry && (
                <p className="mt-1 text-sm text-red-600">{errors.hotelCountry.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">District</label>
              <input
                type="text"
                {...register('hotelDistrict')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Room Images</h2>
          <div className="mt-2 flex flex-wrap gap-4">
            {hotelImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Upload Image</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Additional Options Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Additional Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                {...register('category')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="Budget">Budget</option>
                <option value="Standard">Standard</option>
                <option value="Luxury">Luxury</option>
                <option value="Boutique">Boutique</option>
                <option value="Resort">Resort</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                {...register('discount')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <select
                {...register('hotelRating')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                  <option key={rating} value={rating.toString()}>
                    {rating} {rating === 1 ? 'star' : 'stars'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Review Count</label>
              <input
                type="number"
                min="0"
                {...register('hotelReviewCount')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </form>
    </div>
  );
}