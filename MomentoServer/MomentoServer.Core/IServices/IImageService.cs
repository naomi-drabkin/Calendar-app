using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.DTOs.ImagesDTOs;

namespace MomentoServer.Core.IServices
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(ImageCreateDTO imageDto, int userId);
        Task<List<ImageDTO>> GetAllImagesAsync(int userId);
        Task<ImageDTO?> GetImageByIdAsync(int id);
        Task<bool> UpdateImageAsync(int id, ImageUpdateDTO imageDto);
        Task<bool> DeleteImageAsync(int id);
        Task<bool> DeleteAllImagesByIdAsync(int id);

    }
}
