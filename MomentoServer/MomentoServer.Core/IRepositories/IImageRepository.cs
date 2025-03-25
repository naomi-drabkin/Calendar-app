using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MomentoServer.Core.Entities;

namespace MomentoServer.Core.IRepositories
{
    public interface IImageRepository
    {
        Task<bool> AddImageAsync(Image image);
        Task<Image?> GetImageByIdAsync(int id);
        Task<List<Image>> GetAllImagesCalendarAsync(List<Image> IdImages, int numOfCalendar);
        Task<List<Image>> GetAllImagesAsync(int userId);
        Task<bool> UpdateImageAsync(int id, Image image);
        Task<bool> DeleteImageAsync(Image image);
        //Task DeleteImageByIdAsync(Image image);



    }
}
