using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
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

        public async Task<string> UploadImageAsync(ImageCreateDTO imageDto, int userId)
        {
            if (imageDto.File == null || imageDto.File.Length == 0)
                throw new ArgumentException("Invalid file.");

            if (imageDto.UploadDate == default)
                throw new ArgumentException("Upload date is required.");

            var allowedExtensions = new[] { ".jpg", ".jpeg" };
            var fileExtension = Path.GetExtension(imageDto.File.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
                throw new ArgumentException("Only JPG or JPEG files are allowed.");

            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            Console.WriteLine($"{Guid.NewGuid()}{fileExtension}");
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "ImagesUploads");
            var filePath = Path.Combine(folderPath, fileName);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageDto.File.CopyToAsync(stream);
            }

            var imageEntity = _mapper.Map<Image>(imageDto);
            imageEntity.UserId = userId;
            imageEntity.FileName = fileName;
            imageEntity.FilePath = filePath;

            await _imageRepository.SaveImageAsync(imageEntity);
            return fileName;
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

            if (imageDto.File != null)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(imageDto.File.FileName).ToLower()}";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "ImagesUploads", fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageDto.File.CopyToAsync(stream);
                }

                if (File.Exists(image.FilePath))
                    File.Delete(image.FilePath);

                image.FileName = fileName;
                image.FilePath = filePath;
            }

            _mapper.Map(imageDto, image);
            await _imageRepository.UpdateImageAsync(image);
            return true;
        }

        public async Task<bool> DeleteImageAsync(int id)
        {
            var image = await _imageRepository.GetImageByIdAsync(id);
            if (image == null) return false;

            if (File.Exists(image.FilePath))
                File.Delete(image.FilePath);

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
