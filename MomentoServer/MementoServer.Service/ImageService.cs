using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MementoServer.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using MomentoServer.Core.DTOs.ImagesDTOs;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IRepositories;
using MomentoServer.Core.IServices;

namespace MementoServer.Service
{
    public class ImageService : IImageService
    {
        private readonly IImageRepository _imageRepository;
        private readonly IMapper _mapper;

        public ImageService(IImageRepository imageRepository, IMapper mapper)
        {
            _imageRepository = imageRepository;
            _mapper = mapper;
        }

        public async Task<bool> PostImageAsync(ImageCreateDTO imageDto, int userId)
        {

            var ImageEntity = _mapper.Map<Image>(imageDto);
            ImageEntity.Url = imageDto.Url;

            ImageEntity.UploadDate = DateTime.Now;
            return await _imageRepository.AddImageAsync(ImageEntity);

        }

        public async Task<List<ImageDTO>> GetAllImagesAsync(int userId)
        {
            var images = await _imageRepository.GetAllImagesAsync(userId);
            return _mapper.Map<List<ImageDTO>>(images);
        }

        public async Task<ImageDTO?> GetImageByIdAsync(int id)
        {
            var image = await _imageRepository.GetImageByIdAsync(id);
            return _mapper.Map<ImageDTO>(image);
        }

        public async Task<bool> UpdateImageAsync(int id, ImageUpdateDTO imageDto)
        {
            var image = await _imageRepository.GetImageByIdAsync(id);
            if (image == null) return false;

            image.UpdateUpload = DateTime.Now;
            await _imageRepository.UpdateImageAsync(image);
            return true;
        }

        public async Task<bool> DeleteImageAsync(int id)
        {
            var image = await _imageRepository.GetImageByIdAsync(id);
            if (image == null) return false;

            await _imageRepository.DeleteImageAsync(image);
            return true;
        }


        public async Task<bool> DeleteAllImagesByIdAsync(int id)
        {

            var Images = _imageRepository.GetAllImagesAsync(id).Result.ToList();
            if (Images != null)
            {
                foreach (var Image in Images)
                {
                    await _imageRepository.DeleteImageAsync(Image);
                }

                return true;

            }
            return false;
        }
    }
}
