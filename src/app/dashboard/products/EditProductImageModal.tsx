'use client';
import { Asset, Product, ProductColor } from '@prisma/client';
import { Modal } from '@/components/Modal';
import Image from 'next/image';
import React, { useState, useTransition } from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { deleteAsset, updateAsset } from '@/app/_actions/assets';
import toast from 'react-hot-toast';
import { AssetFolder } from '@/components/forms/AddCategoryForm';

export type EditImagesProduct = Product & {
  colors: (ProductColor & { mainImage: Asset; images: Asset[] })[];
  mainImage: Asset;
};
type ProductImageProps = {
  product: EditImagesProduct;
};

const EditProductImagesModal: React.FC<ProductImageProps> = ({ product }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [action, setAction] = useState<'update' | 'delete'>();
  const [imgType, setImgType] = useState<'main' | 'color main' | 'color'>();
  const [selectedAsset, setSelectedAsset] = useState<Asset>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChangeColor = (index: number) => {
    setSelectedColorIndex(index);
  };

  const handleUpdateMainImage = (newMainImage: Asset) => {
    setImgType('main');
    setAction('update');
    dialogRef.current?.showModal();
    setSelectedAsset(newMainImage);
  };

  const handleUpdateColorImage = (asset: Asset, isMain: boolean = false) => {
    setImgType(isMain ? 'color main' : 'color');
    setAction('update');
    dialogRef.current?.showModal();
    setSelectedAsset(asset);
    console.log('update color image');
  };

  const handleRemoveImage = (asset: Asset, isMain: boolean = false) => {
    setImgType(isMain ? 'color main' : 'color');
    setAction('delete');
    dialogRef.current?.showModal();
    setSelectedAsset(asset);
    console.log('remove image');
  };

  const modalId = `edit_product_images_${product.id}`;

  const resetActions = () => {
    setAction(undefined);
    setImgType(undefined);
    setSelectedAsset(undefined);
    fileInputRef.current?.value && (fileInputRef.current.value = '');
    dialogRef.current?.close();
  };

  const handleDelete = async () => {
    const formData = new FormData();
    if (!selectedAsset) return toast.error('No asset selected');
    formData.append('assetId', selectedAsset.id);
    startTransition(async () => {
      const [error] = await deleteAsset(formData);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Image deleted successfully');
        resetActions();
      }
    });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return toast.error('No file selected');
    if (!selectedAsset) return toast.error('No asset selected');
    if (!file.type.includes('image')) {
      return toast.error('File must be an image');
    }

    formData.append('image', file);
    formData.append('assetId', selectedAsset.id);
    formData.append('folder', AssetFolder.ProductImages);

    startTransition(async () => {
      const [error] = await updateAsset(formData);
      if (error) {
        toast.error(error as string);
      } else {
        toast.success('Image updated successfully');
        resetActions();
      }
    });
  };

  return (
    <Modal
      modalId={modalId}
      btnContent={<></>}
      btn={
        <button
          type="submit"
          className="btn btn-sm btn-square btn-primary btn-outline"
        >
          <MdEdit />
        </button>
      }
    >
      {
        <dialog ref={dialogRef} id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              <span className="capitalize">{action}</span> product {imgType}{' '}
              image
            </h3>
            {action === 'delete' && (
              <div className="flex flex-col gap-2">
                <p className="text-sm space-y-2">
                  Are you sure you want to `{action}` this `{imgType}` image?
                </p>
                <button className="btn btn-error" onClick={handleDelete}>
                  <MdDeleteForever /> Delete
                </button>
              </div>
            )}
            {action === 'update' && (
              <div className="flex flex-col gap-2">
                <div className="form-control w-full max-w-lg">
                  <label className="label">
                    <span className="label-text">Choose a new image</span>
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    name="image"
                    className="file-input file-input-bordered file-input-info w-full max-w-xs"
                  />{' '}
                </div>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  <MdEdit /> Update
                </button>
              </div>
            )}

            {isPending && (
              <div className="flex items-center gap-2 justify-center w-full">
                <span className="loading loading-spinner loading-lg" />
                <span className="font-bold text-lg">
                  {action === 'delete' ? 'Deleting' : 'Updating'}
                </span>
              </div>
            )}
          </div>

          <form method="dialog" className={isPending ? '' : 'modal-backdrop'}>
            <button disabled={isPending}>
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-lg" />
                  <span className="font-bold text-lg">
                    {action === 'delete' ? 'Deleting' : 'Updating'}
                  </span>
                </>
              ) : (
                <>Close</>
              )}
            </button>
          </form>
        </dialog>
      }
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Product Images</h2>
        <div className="flex flex-col">
          <div className="flex flex-col items-center space-y-2">
            <Image
              src={product.mainImage.secureUrl}
              alt="Main Product"
              height={64}
              width={64}
              className="w-16 bg-base-200 h-16 object-cover rounded-md"
            />
            <div className="flex space-x-2">
              <button
                className="text-xs btn-circle max-w-full flex-wrap btn btn-sm btn-info"
                onClick={() => handleUpdateMainImage(product.mainImage)}
              >
                <MdEdit />
              </button>
            </div>
          </div>
          <h3 className="text-sm font-semibold mb-2">Select Color:</h3>
          <div className="flex items-center mb-2 gap-2">
            {product.colors.map((color, index) => (
              <button
                key={color.id}
                className={`border-2 ${
                  index === selectedColorIndex
                    ? 'border-secondary'
                    : 'border-transparent'
                } rounded-full w-16 h-16 overflow-hidden`}
                onClick={() => handleChangeColor(index)}
              >
                <Image
                  width={64}
                  height={64}
                  alt="Color Product"
                  className="w-16 h-16 object-cover rounded-md"
                  src={color.mainImage.secureUrl}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Images */}
        <div className="flex items-center border-y my-2 py-1 gap-2">
          {[
            product.colors[selectedColorIndex].mainImage,
            ...product.colors[selectedColorIndex].images,
          ].map((image, i) => (
            <div
              key={image.secureUrl}
              className="flex flex-col gap-2 flex-1 items-center"
            >
              <Image
                width={64}
                height={64}
                src={image.secureUrl}
                alt="Color Product"
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex items-center bg-base-200 p-1 gap-2 ">
                <button
                  className="text-xs btn-circle max-w-full flex-wrap btn btn-sm btn-info"
                  onClick={() => handleUpdateColorImage(image, i === 0)}
                >
                  <MdEdit />
                </button>
                {i !== 0 && (
                  <button
                    className="text-xs btn-circle max-w-full flex-wrap btn btn-sm btn-error"
                    onClick={() => handleRemoveImage(image, i === 0)}
                  >
                    <MdDeleteForever />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default EditProductImagesModal;
