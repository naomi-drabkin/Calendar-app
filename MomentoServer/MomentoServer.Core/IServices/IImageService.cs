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
        Task<bool> PostImageAsync(ImageCreateDTO imageDto, int userId, int numOfCalendar);
        Task<List<ImageDTO>> GetAllImagesAsync(int userId, int numOfCalendar);
        Task<ImageDTO?> GetImageByIdAsync(int id);
        Task<bool> UpdateImageAsync(int id,int numOfCalendar, ImageUpdateDTO imageDto);
        Task<bool> DeleteImageAsync(int id);
        Task<bool> DeleteAllImagesByIdAsync(int id);

    }
}
